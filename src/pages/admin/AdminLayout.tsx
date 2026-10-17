import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { StorageService, subscribeToStorageChanges } from '../../services/storage';
import { Order, Reservation } from '../../types';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tags,
  Tag,
  MapPin,
  Truck,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  RotateCcw,
  Menu,
  X,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab:
    | 'overview'
    | 'orders'
    | 'menu'
    | 'categories'
    | 'deals'
    | 'branches'
    | 'delivery-areas'
    | 'reservations'
    | 'inquiries'
    | 'settings';
  onTabChange: (tab: any) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  children,
}) => {
  const { user, logout, isAuthenticated } = useAdmin();
  const { config, navigateTo, showToast } = useRestaurant();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    navigateTo('/admin/login');
    return null;
  }

  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [reservations, setReservations] = useState<Reservation[]>(() => StorageService.getReservations());

  useEffect(() => {
    const syncData = () => {
      setOrders(StorageService.getOrders());
      setReservations(StorageService.getReservations());
    };
    syncData();
    const unsubscribe = subscribeToStorageChanges(syncData);
    return unsubscribe;
  }, []);

  const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'out_for_delivery').length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;

  const navItems = [
    { id: 'overview', label: 'Admin Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Management', icon: ShoppingBag, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'deals', label: 'Deals & Combos', icon: Tag },
    { id: 'branches', label: 'Branch Management', icon: MapPin },
    { id: 'delivery-areas', label: 'Delivery Areas', icon: Truck },
    { id: 'reservations', label: 'Reservations', icon: Calendar, badge: pendingReservationsCount > 0 ? pendingReservationsCount : undefined },
    { id: 'inquiries', label: 'Customer Inquiries', icon: MessageSquare },
    { id: 'settings', label: 'Website Settings', icon: Settings },
  ];

  const handleResetDefaults = () => {
    if (confirm('Restore sample demonstration data? Any custom items will be reset.')) {
      StorageService.resetAllDefaults();
      showToast('Demonstration data restored.', 'info');
    }
  };

  const handleItemClick = (id: string) => {
    onTabChange(id);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col">
      {/* Admin Top Bar */}
      <header className="bg-[#26231F] text-white sticky top-0 z-40 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 text-white"
              aria-label="Toggle admin sidebar"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => navigateTo('/')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#B64E35] flex items-center justify-center text-white">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-white leading-none block">
                  {config.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#F5E9E2]/70">
                  DineFrame Console
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Website</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-400/10 px-3 py-1.5 rounded-lg transition-colors"
              title="Reset sample demonstration data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            <div className="h-6 w-px bg-white/20 hidden sm:block" />

            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white">{user?.name}</div>
              <div className="text-[10px] text-white/60 capitalize">
                {user?.role.replace(/_/g, ' ')}
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 gap-8">
        {/* Sidebar Desktop */}
        <aside className="w-64 shrink-0 hidden lg:block space-y-1 bg-white p-3 rounded-3xl border border-[#E8E2DA] shadow-2xs h-fit sticky top-24">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#77736D]">
            Management Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#B64E35] text-white shadow-xs'
                    : 'text-[#25231F] hover:bg-[#FAF8F4]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-[#B64E35]' : 'bg-[#B64E35] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-[#FAF8F4] px-3">
            <button
              onClick={handleResetDefaults}
              className="w-full text-left text-[11px] text-amber-700 hover:text-amber-800 flex items-center gap-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 space-y-2 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
                <span className="font-serif font-bold text-lg text-[#25231F]">
                  Admin Menu
                </span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 text-[#77736D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#B64E35] text-white'
                        : 'text-[#25231F] hover:bg-[#FAF8F4]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B64E35] text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-[#E8E2DA] space-y-2">
                <button
                  onClick={() => navigateTo('/')}
                  className="w-full py-2 px-3 text-xs text-[#25231F] bg-[#FAF8F4] rounded-lg text-left"
                >
                  Go to Customer Website →
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2 px-3 text-xs text-rose-600 rounded-lg text-left"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Pane */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
