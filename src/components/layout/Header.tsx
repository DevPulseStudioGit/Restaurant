import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  ShoppingBag,
  MapPin,
  Menu,
  X,
  Phone,
  Flame,
  Search,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    config,
    orderType,
    selectedBranch,
    selectedDeliveryArea,
    openBranchModal,
    cartCount,
    currentPath,
    navigateTo,
  } = useRestaurant();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    ...(config.features.dealsEnabled ? [{ label: 'Deals & Combos', path: '/deals' }] : []),
    { label: 'Our Story', path: '/about' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Branches', path: '/locations' },
    ...(config.features.reservationsEnabled ? [{ label: 'Reservation', path: '/reservation' }] : []),
    { label: 'Track Order', path: '/track-order' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigateTo(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E8E2DA] transition-all">
      {/* Top micro-bar: Location & Timings info */}
      <div className="bg-[#26231F] text-white/80 text-xs py-1.5 px-4 hidden sm:block border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white/90">
              <Clock className="w-3.5 h-3.5 text-[#B64E35]" />
              {config.openingHoursSummary}
            </span>
            <span className="text-white/40">·</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#B64E35]" />
              Call Concierge: <a href={`tel:${config.contactPhone}`} className="hover:text-white transition-colors underline decoration-white/30">{config.contactPhone}</a>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/60 text-[11px]">
              Karachi, Pakistan
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#26231F] text-white flex flex-col items-center justify-center font-serif font-black shadow-xs group-hover:bg-[#B64E35] transition-colors">
              <Flame className="w-5 h-5 text-[#B64E35] group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#25231F] flex items-center gap-1.5 leading-none">
                {config.name}
              </div>
              <p className="text-[10px] tracking-widest uppercase text-[#77736D] font-medium mt-0.5">
                {config.tagline.split('&')[0].trim()}
              </p>
            </div>
          </div>

          {/* Location & Order Type Selector Badge */}
          <button
            type="button"
            onClick={openBranchModal}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E2DA] hover:border-[#B64E35]/40 text-left transition-all shadow-2xs group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#F5E9E2] flex items-center justify-center text-[#B64E35] group-hover:bg-[#B64E35] group-hover:text-white transition-colors">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-[#25231F] flex items-center gap-1">
                <span className="capitalize text-[#B64E35]">{orderType}</span>
                {orderType === 'delivery' && selectedDeliveryArea && (
                  <span className="text-[#25231F]">· {selectedDeliveryArea.name}</span>
                )}
                <ChevronDown className="w-3 h-3 text-[#77736D] ml-0.5" />
              </div>
              <div className="text-[11px] text-[#77736D] truncate max-w-[150px]">
                {selectedBranch ? selectedBranch.name : 'Choose Branch'}
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#B64E35] font-semibold'
                      : 'text-[#25231F] hover:text-[#B64E35]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B64E35] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Cart & Order Now */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick search shortcut */}
            <button
              onClick={() => handleNavClick('/menu')}
              className="p-2.5 text-[#25231F] hover:text-[#B64E35] hover:bg-white rounded-xl transition-colors hidden sm:flex items-center justify-center border border-transparent hover:border-[#E8E2DA]"
              title="Search menu"
              aria-label="Search menu"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleNavClick('/cart')}
              className="relative flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-white border border-[#E8E2DA] hover:border-[#B64E35]/40 text-[#25231F] transition-all shadow-2xs group"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#25231F] group-hover:text-[#B64E35] transition-colors" />
              <span className="text-xs sm:text-sm font-semibold hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#B64E35] text-white text-[11px] font-bold flex items-center justify-center animate-in zoom-in-50 duration-150">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Order Now Button */}
            <button
              onClick={() => handleNavClick('/menu')}
              className="hidden sm:inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-[#F5E9E2]" />
              Order Online
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-[#25231F] hover:bg-white rounded-xl border border-[#E8E2DA] lg:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Branch Bar (Visible only on small screens) */}
      <div className="md:hidden px-4 py-2 bg-white border-t border-[#E8E2DA] flex items-center justify-between">
        <button
          onClick={openBranchModal}
          className="flex items-center gap-2 text-xs text-[#25231F] text-left"
        >
          <MapPin className="w-3.5 h-3.5 text-[#B64E35] shrink-0" />
          <span className="truncate">
            <strong className="capitalize text-[#B64E35]">{orderType}:</strong>{' '}
            {orderType === 'delivery' && selectedDeliveryArea
              ? selectedDeliveryArea.name
              : selectedBranch?.name}
          </span>
          <span className="text-[10px] text-[#B64E35] font-semibold underline shrink-0 ml-1">Change</span>
        </button>
        <button
          onClick={() => handleNavClick('/track-order')}
          className="text-[11px] font-medium text-[#77736D] hover:text-[#25231F] shrink-0"
        >
          Track Order
        </button>
      </div>

      {/* Mobile Slide-down Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8E2DA] shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-5 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F5E9E2] text-[#B64E35] font-semibold'
                      : 'text-[#25231F] hover:bg-[#FAF8F4]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-[#E8E2DA]">
              <button
                onClick={() => {
                  openBranchModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] border border-[#E8E2DA] text-xs font-medium text-[#25231F]"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B64E35]" />
                  <span>Change Branch / Order Mode</span>
                </div>
                <span className="text-[#B64E35] font-semibold uppercase">{orderType}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
