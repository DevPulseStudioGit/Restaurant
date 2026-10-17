import React, { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BranchSelectorModal } from './components/common/BranchSelectorModal';
import { ToastContainer } from './components/common/ToastContainer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { DealsPage } from './pages/DealsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { LocationsPage } from './pages/LocationsPage';
import { ReservationPage } from './pages/ReservationPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { LegalPage } from './pages/LegalPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminMenu } from './pages/admin/AdminMenu';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminDeals } from './pages/admin/AdminDeals';
import { AdminBranches } from './pages/admin/AdminBranches';
import { AdminDeliveryAreas } from './pages/admin/AdminDeliveryAreas';
import { AdminReservations } from './pages/admin/AdminReservations';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminSettings } from './pages/admin/AdminSettings';

const AppContent: React.FC = () => {
  const { currentPath, navigateTo } = useRestaurant();
  const { isAuthenticated } = useAdmin();

  // Admin sub-tab management
  const [adminTab, setAdminTab] = useState<
    | 'overview'
    | 'orders'
    | 'menu'
    | 'categories'
    | 'deals'
    | 'branches'
    | 'delivery-areas'
    | 'reservations'
    | 'inquiries'
    | 'settings'
  >('overview');

  // Match path to admin sub-tabs if accessed directly e.g. /admin/menu
  useEffect(() => {
    if (currentPath.startsWith('/admin/')) {
      const sub = currentPath.replace('/admin/', '');
      const validTabs = [
        'overview',
        'orders',
        'menu',
        'categories',
        'deals',
        'branches',
        'delivery-areas',
        'reservations',
        'inquiries',
        'settings',
      ];
      if (validTabs.includes(sub)) {
        setAdminTab(sub as any);
      }
    }
  }, [currentPath]);

  // Route: Admin Login
  if (currentPath === '/admin/login') {
    return <AdminLogin />;
  }

  // Route: Admin Area
  if (currentPath.startsWith('/admin')) {
    if (!isAuthenticated) {
      return <AdminLogin />;
    }

    const renderAdminView = () => {
      switch (adminTab) {
        case 'overview':
          return <AdminOverview onNavigateTab={(tab) => setAdminTab(tab as any)} />;
        case 'orders':
          return <AdminOrders />;
        case 'menu':
          return <AdminMenu />;
        case 'categories':
          return <AdminCategories />;
        case 'deals':
          return <AdminDeals />;
        case 'branches':
          return <AdminBranches />;
        case 'delivery-areas':
          return <AdminDeliveryAreas />;
        case 'reservations':
          return <AdminReservations />;
        case 'inquiries':
          return <AdminInquiries />;
        case 'settings':
          return <AdminSettings />;
        default:
          return <AdminOverview onNavigateTab={(tab) => setAdminTab(tab as any)} />;
      }
    };

    return (
      <AdminLayout currentTab={adminTab} onTabChange={setAdminTab}>
        {renderAdminView()}
      </AdminLayout>
    );
  }

  // Route: Customer Website Pages
  const renderCustomerPage = () => {
    const path = currentPath.split('?')[0];

    switch (path) {
      case '/':
        return <HomePage />;
      case '/menu':
        return <MenuPage />;
      case '/deals':
        return <DealsPage />;
      case '/cart':
        return <CartPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/order-confirmation':
        return <OrderConfirmationPage />;
      case '/track-order':
        return <OrderTrackingPage />;
      case '/about':
        return <AboutPage />;
      case '/gallery':
        return <GalleryPage />;
      case '/locations':
        return <LocationsPage />;
      case '/reservation':
        return <ReservationPage />;
      case '/contact':
        return <ContactPage />;
      case '/faq':
        return <FaqPage />;
      case '/delivery-policy':
        return <LegalPage initialTab="delivery" />;
      case '/privacy-policy':
        return <LegalPage initialTab="privacy" />;
      case '/terms':
        return <LegalPage initialTab="terms" />;
      default:
        // Check dynamic product or category routes
        if (path.startsWith('/product/') || path.startsWith('/menu')) {
          return <MenuPage />;
        }
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#25231F] selection:bg-[#B64E35]/20 selection:text-[#B64E35]">
      <Header />
      <main className="flex-1 min-w-0">{renderCustomerPage()}</main>
      <Footer />

      {/* Global Interactive Elements */}
      <BranchSelectorModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RestaurantProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </RestaurantProvider>
  );
};

export default App;
