import React, { useState, useEffect } from 'react';
import { StorageService, subscribeToStorageChanges } from '../../services/storage';
import { Order, OrderStatus } from '../../types';
import {
  Banknote,
  ShoppingBag,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ChefHat,
  Bike
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
  onSelectOrder?: (order: Order) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab, onSelectOrder }) => {
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [reservations, setReservations] = useState(() => StorageService.getReservations());
  const [products, setProducts] = useState(() => StorageService.getProducts());

  useEffect(() => {
    const syncData = () => {
      setOrders(StorageService.getOrders());
      setReservations(StorageService.getReservations());
      setProducts(StorageService.getProducts());
    };
    syncData();
    const unsubscribe = subscribeToStorageChanges(syncData);
    return unsubscribe;
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing' || o.status === 'out_for_delivery'
  );

  const pendingReservations = reservations.filter((r) => r.status === 'pending');

  const handleQuickStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    StorageService.updateOrderStatus(orderId, nextStatus, `Updated from Admin Overview`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-[11px] font-bold">New Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Confirmed</span>;
      case 'preparing':
        return <span className="bg-orange-100 text-orange-800 px-2.5 py-1 rounded-md text-[11px] font-bold">In Kitchen</span>;
      case 'out_for_delivery':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md text-[11px] font-bold">With Rider</span>;
      case 'ready_for_pickup':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Ready Counter</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md text-[11px] font-bold">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Operations Dashboard
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
          Restaurant Overview
        </h1>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8E2DA] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#77736D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-[#25231F]">
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#77736D]">Across all orders in Karachi</div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8E2DA] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#77736D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-[#25231F]">
            {orders.length}
          </div>
          <div className="text-[11px] text-[#77736D]">Recorded in system</div>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8E2DA] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#77736D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Active In-Kitchen</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-[#B64E35]">
            {activeOrders.length}
          </div>
          <div className="text-[11px] text-[#77736D]">Require attention or transit</div>
        </div>

        {/* Table Reservations */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8E2DA] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#77736D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-[#25231F]">
            {pendingReservations.length}
          </div>
          <div className="text-[11px] text-[#77736D]">Table requests to confirm</div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#25231F]">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-[#77736D]">
              Live stream of orders submitted via web portal.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#B64E35] hover:text-[#9B3F28] inline-flex items-center gap-1"
          >
            Manage All Orders <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E2DA] text-[#77736D] uppercase tracking-wider font-semibold">
                <th className="pb-3">Reference</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Type & Branch</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F4]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF8F4]/60 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#25231F]">
                    {order.orderReference}
                  </td>
                  <td className="py-3.5">
                    <div className="font-medium text-[#25231F]">{order.customer.name}</div>
                    <div className="text-[11px] text-[#77736D]">{order.customer.phone}</div>
                  </td>
                  <td className="py-3.5">
                    <span className="capitalize font-medium text-[#25231F]">{order.orderType}</span>
                    <div className="text-[11px] text-[#77736D]">{order.branchName}</div>
                  </td>
                  <td className="py-3.5 font-bold text-[#25231F]">
                    Rs. {order.total.toLocaleString()}
                  </td>
                  <td className="py-3.5">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 text-right space-x-1.5">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleQuickStatusChange(order.id, 'confirmed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px]"
                      >
                        Accept
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleQuickStatusChange(order.id, 'preparing')}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px]"
                      >
                        Start Cooking
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() =>
                          handleQuickStatusChange(
                            order.id,
                            order.orderType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery'
                          )
                        }
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px]"
                      >
                        {order.orderType === 'pickup' ? 'Ready' : 'Dispatch'}
                      </button>
                    )}
                    {(order.status === 'out_for_delivery' || order.status === 'ready_for_pickup') && (
                      <button
                        onClick={() => handleQuickStatusChange(order.id, 'completed')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px]"
                      >
                        Delivered
                      </button>
                    )}
                    <button
                      onClick={() => onNavigateTab('orders')}
                      className="bg-[#FAF8F4] hover:bg-[#E8E2DA] text-[#25231F] px-2.5 py-1 rounded-lg text-[11px] font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Launchpad Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('menu')}
          className="bg-white p-5 rounded-2xl border border-[#E8E2DA] hover:border-[#B64E35]/40 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
        >
          <div>
            <h4 className="font-serif font-bold text-base text-[#25231F] group-hover:text-[#B64E35]">
              Manage Menu Dishes ({products.length})
            </h4>
            <p className="text-xs text-[#77736D] mt-0.5">
              Add new Karahis, update prices, edit spice levels
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#B64E35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>

        <div
          onClick={() => onNavigateTab('branches')}
          className="bg-white p-5 rounded-2xl border border-[#E8E2DA] hover:border-[#B64E35]/40 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
        >
          <div>
            <h4 className="font-serif font-bold text-base text-[#25231F] group-hover:text-[#B64E35]">
              Kitchen Branches (3)
            </h4>
            <p className="text-xs text-[#77736D] mt-0.5">
              Edit operational hours, minimum orders, fees
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#B64E35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>

        <div
          onClick={() => onNavigateTab('settings')}
          className="bg-white p-5 rounded-2xl border border-[#E8E2DA] hover:border-[#B64E35]/40 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
        >
          <div>
            <h4 className="font-serif font-bold text-base text-[#25231F] group-hover:text-[#B64E35]">
              Customize Restaurant Brand
            </h4>
            <p className="text-xs text-[#77736D] mt-0.5">
              Name, logo, color palette, delivery toggles
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#B64E35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
