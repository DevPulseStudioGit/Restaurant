import 'dotenv/config';
import express from 'express';
import { parse, serialize } from 'cookie';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  initialRestaurantConfig,
  initialBranches,
  initialDeliveryAreas,
  initialCategories,
  initialProducts,
  initialDeals,
  initialOrders,
  initialReservations,
  initialInquiries,
} from '../src/data/initialData';

const port = Number(process.env.PORT || 8787);
const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME || 'dineframe';
const jwtSecret = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

if (typeof mongoUri !== 'string' || typeof jwtSecret !== 'string' || typeof process.env.ADMIN_PASSWORD !== 'string') {
  throw new Error('MONGODB_URI, JWT_SECRET, and ADMIN_PASSWORD are required. Configure them in .env.');
}
const signingSecret: string = jwtSecret;

const client = new MongoClient(mongoUri);
let isConnected = false;
const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'super_admin';
};

function getAdminFromRequest(req: express.Request): AdminUser | null {
  const token = parse(req.headers.cookie || '').dineframe_session;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, signingSecret) as jwt.JwtPayload & Partial<AdminUser>;
    if (payload.role !== 'super_admin' || !payload.id || !payload.email || !payload.name) return null;
    return {
      id: String(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: 'super_admin',
    };
  } catch {
    return null;
  }
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const admin = getAdminFromRequest(req);
  if (!admin) return res.status(401).json({ error: 'Authentication required' });
  res.locals.admin = admin;
  next();
}

const seedData = {
  config: initialRestaurantConfig,
  branches: initialBranches,
  deliveryAreas: initialDeliveryAreas,
  categories: initialCategories,
  products: initialProducts,
  deals: initialDeals,
  orders: initialOrders,
  reservations: initialReservations,
  inquiries: initialInquiries,
} as const;

const collectionNames = Object.keys(seedData) as Array<keyof typeof seedData>;
type StoredDocument = { _id: string; [key: string]: unknown };

async function getDatabase() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client.db(databaseName);
}

async function ensureSeeded() {
  const db = await getDatabase();
  for (const name of collectionNames) {
    const collection = db.collection<StoredDocument>(name);
    if (await collection.countDocuments() === 0) {
      const data = seedData[name];
      if (name === 'config') {
        await collection.insertOne({ _id: 'singleton', ...data });
      } else {
        const items = data as readonly { id: string }[];
        if (items.length > 0) {
          await collection.insertMany(items.map((item) => ({ ...item, _id: item.id })));
        }
      }
    }
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    await getDatabase();
    res.json({ ok: true });
  } catch (error) {
    console.error('MongoDB health check failed', error);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

app.post('/api/auth/login', loginLimiter, (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@dineframe.pk').toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (email === expectedEmail && password === expectedPassword) {
    const user: AdminUser = { id: 'usr-admin-1', name: 'Executive Concierge', email, role: 'super_admin' };
    const token = jwt.sign(user, signingSecret, { expiresIn: '8h', issuer: 'dineframe' });
    res.setHeader('Set-Cookie', serialize('dineframe_session', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 8 * 60 * 60,
      path: '/',
    }));
    return res.json({ user });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/auth/session', (req, res) => {
  const user = getAdminFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  return res.json({ user });
});

app.post('/api/auth/logout', (_req, res) => {
  res.setHeader('Set-Cookie', serialize('dineframe_session', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  }));
  return res.status(204).send();
});

app.get('/api/bootstrap', async (_req, res) => {
  try {
    await ensureSeeded();
    const db = await getDatabase();
    const result: Record<string, unknown> = {};
    for (const name of collectionNames) {
      const documents = await db.collection<StoredDocument>(name).find().toArray();
      result[name] = name === 'config'
        ? documents[0] && Object.fromEntries(Object.entries(documents[0]).filter(([key]) => key !== '_id'))
        : documents.map(({ _id, ...document }) => document);
    }
    res.json(result);
  } catch (error) {
    console.error('Failed to load MongoDB bootstrap data', error);
    res.status(503).json({ error: 'Unable to load restaurant data' });
  }
});

app.put('/api/:collection/:id', requireAdmin, async (req, res) => {
  const collectionName = req.params.collection as keyof typeof seedData;
  if (!collectionNames.includes(collectionName)) return res.status(404).json({ error: 'Unknown collection' });
  try {
    const db = await getDatabase();
    const document = { ...req.body, _id: collectionName === 'config' ? 'singleton' : req.params.id };
    await db.collection<StoredDocument>(collectionName).replaceOne({ _id: document._id }, document, { upsert: true });
    const { _id, ...response } = document;
    res.json(response);
  } catch (error) {
    console.error(`Failed to save ${collectionName}`, error);
    res.status(503).json({ error: 'Unable to save data' });
  }
});

app.delete('/api/:collection/:id', requireAdmin, async (req, res) => {
  const collectionName = req.params.collection as keyof typeof seedData;
  if (!collectionNames.includes(collectionName) || collectionName === 'config') {
    return res.status(404).json({ error: 'Unknown or protected collection' });
  }
  try {
    const db = await getDatabase();
    await db.collection<StoredDocument>(collectionName).deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (error) {
    console.error(`Failed to delete from ${collectionName}`, error);
    res.status(503).json({ error: 'Unable to delete data' });
  }
});

async function start() {
  await ensureSeeded();
  const distPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
  app.use(express.static(distPath, { index: 'index.html' }));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  app.listen(port, '0.0.0.0', () => console.log(`DineFrame API listening on port ${port}`));
}

start().catch((error) => {
  console.error('Unable to start DineFrame API', error);
  process.exit(1);
});
