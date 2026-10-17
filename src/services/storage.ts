import {
  RestaurantConfig,
  Branch,
  DeliveryArea,
  Category,
  Product,
  Deal,
  Order,
  Reservation,
  CustomerInquiry,
  OrderStatus
} from '../types';
import {
  initialRestaurantConfig,
  initialBranches,
  initialDeliveryAreas,
  initialCategories,
  initialProducts,
  initialDeals,
  initialOrders,
  initialReservations,
  initialInquiries
} from '../data/initialData';

const STORAGE_KEYS = {
  CONFIG: 'dineframe_config_v1',
  BRANCHES: 'dineframe_branches_v1',
  DELIVERY_AREAS: 'dineframe_delivery_areas_v1',
  CATEGORIES: 'dineframe_categories_v1',
  PRODUCTS: 'dineframe_products_v1',
  DEALS: 'dineframe_deals_v1',
  ORDERS: 'dineframe_orders_v1',
  RESERVATIONS: 'dineframe_reservations_v1',
  INQUIRIES: 'dineframe_inquiries_v1',
  ADMIN_TOKEN: 'dineframe_admin_session_v1',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();
const API_BASE = '/api';

type BootstrapData = {
  config: RestaurantConfig;
  branches: Branch[];
  deliveryAreas: DeliveryArea[];
  categories: Category[];
  products: Product[];
  deals: Deal[];
  orders: Order[];
  reservations: Reservation[];
  inquiries: CustomerInquiry[];
};

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `API request failed with status ${response.status}`);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

function persistCollection(collection: string, id: string, value: unknown): void {
  void apiRequest(`/${collection}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(value),
  }).catch((error) => {
    console.error(`MongoDB persistence failed for ${collection}/${id}`, error);
  });
}

function deleteFromCollection(collection: string, id: string): void {
  void apiRequest(`/${collection}/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch((error) => {
    console.error(`MongoDB deletion failed for ${collection}/${id}`, error);
  });
}

export async function initializeStorage(): Promise<void> {
  try {
    const data = await apiRequest<BootstrapData>('/bootstrap');
    safeSet(STORAGE_KEYS.CONFIG, data.config, false);
    safeSet(STORAGE_KEYS.BRANCHES, data.branches, false);
    safeSet(STORAGE_KEYS.DELIVERY_AREAS, data.deliveryAreas, false);
    safeSet(STORAGE_KEYS.CATEGORIES, data.categories, false);
    safeSet(STORAGE_KEYS.PRODUCTS, data.products, false);
    safeSet(STORAGE_KEYS.DEALS, data.deals, false);
    safeSet(STORAGE_KEYS.ORDERS, data.orders, false);
    safeSet(STORAGE_KEYS.RESERVATIONS, data.reservations, false);
    safeSet(STORAGE_KEYS.INQUIRIES, data.inquiries, false);
    notifyListeners();
  } catch (error) {
    console.error('MongoDB bootstrap failed; using cached data until the API is available', error);
  }
}

export const subscribeToStorageChanges = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error(e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dineframe_storage_changed'));
  }
};

// Listen for cross-tab localStorage events
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key && event.key.startsWith('dineframe_')) {
      notifyListeners();
    }
  });
}

const memoryStore: Record<string, string> = {};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem(key) || memoryStore[key]
      : memoryStore[key];
    if (!raw) return JSON.parse(JSON.stringify(fallback));
    return JSON.parse(raw);
  } catch (err) {
    const raw = memoryStore[key];
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return JSON.parse(JSON.stringify(fallback));
  }
}

function safeSet<T>(key: string, val: T, shouldNotify = true): void {
  const serialized = JSON.stringify(val);
  memoryStore[key] = serialized;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, serialized);
    }
  } catch (err) {
    console.warn(`localStorage unavailable, operating in memory:`, err);
  }
  if (shouldNotify) notifyListeners();
}

// Storage API
export const StorageService = {
  // Config
  getConfig(): RestaurantConfig {
    return safeGet<RestaurantConfig>(STORAGE_KEYS.CONFIG, initialRestaurantConfig);
  },
  updateConfig(updated: Partial<RestaurantConfig>): RestaurantConfig {
    const current = this.getConfig();
    const merged: RestaurantConfig = {
      ...current,
      ...updated,
      features: { ...current.features, ...(updated.features || {}) },
      pricing: { ...current.pricing, ...(updated.pricing || {}) },
      theme: { ...current.theme, ...(updated.theme || {}) },
      socials: { ...current.socials, ...(updated.socials || {}) },
    };
    safeSet(STORAGE_KEYS.CONFIG, merged);
    persistCollection('config', 'singleton', merged);
    return merged;
  },

  // Branches
  getBranches(): Branch[] {
    return safeGet<Branch[]>(STORAGE_KEYS.BRANCHES, initialBranches);
  },
  getBranchById(id: string): Branch | undefined {
    return this.getBranches().find((b) => b.id === id);
  },
  saveBranch(branch: Branch): Branch[] {
    const branches = this.getBranches();
    const idx = branches.findIndex((b) => b.id === branch.id);
    if (idx >= 0) {
      branches[idx] = branch;
    } else {
      branches.push(branch);
    }
    safeSet(STORAGE_KEYS.BRANCHES, branches);
    persistCollection('branches', branch.id, branch);
    return branches;
  },
  deleteBranch(id: string): Branch[] {
    const branches = this.getBranches().filter((b) => b.id !== id);
    safeSet(STORAGE_KEYS.BRANCHES, branches);
    deleteFromCollection('branches', id);
    return branches;
  },

  // Delivery Areas
  getDeliveryAreas(): DeliveryArea[] {
    return safeGet<DeliveryArea[]>(STORAGE_KEYS.DELIVERY_AREAS, initialDeliveryAreas);
  },
  saveDeliveryArea(area: DeliveryArea): DeliveryArea[] {
    const areas = this.getDeliveryAreas();
    const idx = areas.findIndex((a) => a.id === area.id);
    if (idx >= 0) {
      areas[idx] = area;
    } else {
      areas.push(area);
    }
    safeSet(STORAGE_KEYS.DELIVERY_AREAS, areas);
    persistCollection('deliveryAreas', area.id, area);
    return areas;
  },
  deleteDeliveryArea(id: string): DeliveryArea[] {
    const areas = this.getDeliveryAreas().filter((a) => a.id !== id);
    safeSet(STORAGE_KEYS.DELIVERY_AREAS, areas);
    deleteFromCollection('deliveryAreas', id);
    return areas;
  },

  // Categories
  getCategories(): Category[] {
    return safeGet<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  },
  saveCategory(category: Category): Category[] {
    const categories = this.getCategories();
    const idx = categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      categories[idx] = category;
    } else {
      categories.push(category);
    }
    safeSet(STORAGE_KEYS.CATEGORIES, categories);
    persistCollection('categories', category.id, category);
    return categories;
  },
  deleteCategory(id: string): Category[] {
    const categories = this.getCategories().filter((c) => c.id !== id);
    safeSet(STORAGE_KEYS.CATEGORIES, categories);
    deleteFromCollection('categories', id);
    return categories;
  },

  // Products
  getProducts(): Product[] {
    return safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  },
  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  },
  getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find((p) => p.slug === slug);
  },
  saveProduct(product: Product): Product[] {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      products[idx] = product;
    } else {
      products.push(product);
    }
    safeSet(STORAGE_KEYS.PRODUCTS, products);
    persistCollection('products', product.id, product);
    return products;
  },
  deleteProduct(id: string): Product[] {
    const products = this.getProducts().filter((p) => p.id !== id);
    safeSet(STORAGE_KEYS.PRODUCTS, products);
    deleteFromCollection('products', id);
    return products;
  },

  // Deals
  getDeals(): Deal[] {
    return safeGet<Deal[]>(STORAGE_KEYS.DEALS, initialDeals);
  },
  getDealBySlug(slug: string): Deal | undefined {
    return this.getDeals().find((d) => d.slug === slug);
  },
  saveDeal(deal: Deal): Deal[] {
    const deals = this.getDeals();
    const idx = deals.findIndex((d) => d.id === deal.id);
    if (idx >= 0) {
      deals[idx] = deal;
    } else {
      deals.push(deal);
    }
    safeSet(STORAGE_KEYS.DEALS, deals);
    persistCollection('deals', deal.id, deal);
    return deals;
  },
  deleteDeal(id: string): Deal[] {
    const deals = this.getDeals().filter((d) => d.id !== id);
    safeSet(STORAGE_KEYS.DEALS, deals);
    deleteFromCollection('deals', id);
    return deals;
  },

  // Orders
  getOrders(): Order[] {
    return safeGet<Order[]>(STORAGE_KEYS.ORDERS, initialOrders);
  },
  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  },
  getOrderByReference(reference: string, phoneQuery?: string): Order | undefined {
    const cleanRef = reference.trim().toUpperCase();
    const orders = this.getOrders();
    return orders.find((o) => {
      const matchRef = o.orderReference.toUpperCase() === cleanRef || o.id === reference;
      if (!matchRef) return false;
      if (phoneQuery && phoneQuery.trim()) {
        const p1 = o.customer.phone.replace(/[\s\-\+]/g, '');
        const p2 = phoneQuery.replace(/[\s\-\+]/g, '');
        return p1.endsWith(p2) || p2.endsWith(p1);
      }
      return true;
    });
  },
  createOrder(order: Order): Order {
    const orders = this.getOrders();
    orders.unshift(order);
    safeSet(STORAGE_KEYS.ORDERS, orders);
    persistCollection('orders', order.id, order);
    return order;
  },
  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | undefined {
    const orders = this.getOrders();
    const target = orders.find((o) => o.id === orderId);
    if (!target) return undefined;

    target.status = status;
    target.updatedAt = new Date().toISOString();
    target.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status transitioned to ${status.replace(/_/g, ' ')}.`,
    });

    safeSet(STORAGE_KEYS.ORDERS, orders);
    persistCollection('orders', target.id, target);
    return target;
  },

  // Reservations
  getReservations(): Reservation[] {
    return safeGet<Reservation[]>(STORAGE_KEYS.RESERVATIONS, initialReservations);
  },
  createReservation(reservation: Reservation): Reservation {
    const resList = this.getReservations();
    resList.unshift(reservation);
    safeSet(STORAGE_KEYS.RESERVATIONS, resList);
    persistCollection('reservations', reservation.id, reservation);
    return reservation;
  },
  updateReservationStatus(id: string, status: Reservation['status']): Reservation | undefined {
    const list = this.getReservations();
    const target = list.find((r) => r.id === id);
    if (target) {
      target.status = status;
      safeSet(STORAGE_KEYS.RESERVATIONS, list);
      persistCollection('reservations', target.id, target);
    }
    return target;
  },

  // Inquiries
  getInquiries(): CustomerInquiry[] {
    return safeGet<CustomerInquiry[]>(STORAGE_KEYS.INQUIRIES, initialInquiries);
  },
  createInquiry(inq: CustomerInquiry): CustomerInquiry {
    const inqs = this.getInquiries();
    inqs.unshift(inq);
    safeSet(STORAGE_KEYS.INQUIRIES, inqs);
    persistCollection('inquiries', inq.id, inq);
    return inq;
  },
  updateInquiryStatus(id: string, status: CustomerInquiry['status']): CustomerInquiry | undefined {
    const inqs = this.getInquiries();
    const target = inqs.find((i) => i.id === id);
    if (target) {
      target.status = status;
      safeSet(STORAGE_KEYS.INQUIRIES, inqs);
      persistCollection('inquiries', target.id, target);
    }
    return target;
  },

  // Admin Auth
  isAdminLoggedIn(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  },
  setAdminLogin(token: string = 'dineframe_mock_session_ok'): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
    notifyListeners();
  },
  setAdminLogout(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    notifyListeners();
  },

  // Reset to showcase defaults
  resetAllDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.BRANCHES);
    localStorage.removeItem(STORAGE_KEYS.DELIVERY_AREAS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.DEALS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    notifyListeners();
  },
};
