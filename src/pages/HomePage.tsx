import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StorageService } from '../services/storage';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { ProductCard } from '../components/menu/ProductCard';
import { ProductCustomizerModal } from '../components/menu/ProductCustomizerModal';
import { Product, Deal } from '../types';
import {
  Search,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Flame,
  Calendar,
  UtensilsCrossed,
  Tag,
  ShieldCheck
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { config, branches, openBranchModal, navigateTo } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<{
    item: Product | Deal;
    isDeal: boolean;
  } | null>(null);

  const categories = StorageService.getCategories().filter((c) => c.active);
  const products = StorageService.getProducts().filter((p) => p.isAvailable);
  const deals = StorageService.getDeals().filter((d) => d.isAvailable);
  const featuredProducts = products.slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo(`/menu?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigateTo('/menu');
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    navigateTo(`/menu?category=${categorySlug}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Signature Hero Carousel */}
      <HeroCarousel />

      {/* 2. Quick Food Search Bar immediately below hero */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 sm:-mt-14 relative z-20">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-2 sm:p-3 rounded-2xl shadow-xl border border-[#E8E2DA] flex items-center gap-2 sm:gap-3"
        >
          <div className="pl-3 text-[#77736D]">
            <Search className="w-5 h-5 text-[#B64E35]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your favourite food (e.g. Mutton Karahi, Dum Biryani, Seekh Kebab)..."
            className="flex-1 text-sm sm:text-base text-[#25231F] placeholder:text-[#77736D]/60 focus:outline-none bg-transparent py-2"
          />
          <button
            type="submit"
            className="bg-[#B64E35] hover:bg-[#9B3F28] text-white font-semibold text-xs sm:text-sm px-5 sm:px-7 py-3 rounded-xl transition-all shadow-xs shrink-0"
          >
            Find Food
          </button>
        </form>
      </div>

      {/* 3. Quick Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
              Curated Offerings
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
              Explore Our Categories
            </h2>
          </div>
          <button
            onClick={() => navigateTo('/menu')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#B64E35] hover:text-[#9B3F28] transition-colors"
          >
            View Full Menu <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2DA] hover:border-[#B64E35]/40 hover:shadow-md transition-all cursor-pointer text-center flex flex-col items-center justify-center space-y-2.5"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F4] group-hover:bg-[#F5E9E2] text-[#B64E35] flex items-center justify-center transition-colors">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#25231F] group-hover:text-[#B64E35] transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Menu Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
              Chef's Signatures
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
              Most Loved Dishes
            </h2>
          </div>
          <button
            onClick={() => navigateTo('/menu')}
            className="text-xs font-semibold text-[#B64E35] hover:text-[#9B3F28] transition-colors inline-flex items-center gap-1"
          >
            Explore All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCustomize={(prod) => setActiveModalItem({ item: prod, isDeal: false })}
            />
          ))}
        </div>
      </section>

      {/* 5. Deals & Combos Showcase (if enabled) */}
      {config.features.dealsEnabled && deals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#26231F] rounded-3xl p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden">
            {/* Background flourish */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#B64E35]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#F5E9E2]">
                  Dastarkhwan Bundles
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-black text-white mt-1">
                  Feast Deals & Combos
                </h2>
                <p className="text-xs sm:text-sm text-white/70 mt-2 max-w-lg">
                  Carefully proportioned culinary banquets with Karahi, Dum Biryani, Sigri BBQ, and traditional desserts at bundled value.
                </p>
              </div>

              <button
                onClick={() => navigateTo('/deals')}
                className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-all self-start md:self-auto"
              >
                <span>View All Combos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="relative h-44 rounded-xl overflow-hidden">
                      <img
                        src={deal.image}
                        alt={deal.name}
                        className="w-full h-full object-cover"
                      />
                      {deal.badge && (
                        <div className="absolute top-3 left-3 bg-[#B64E35] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                          {deal.badge}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-lg text-white">
                        {deal.name}
                      </h3>
                      <p className="text-xs text-white/70 line-clamp-2 mt-1">
                        {deal.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-white/60">
                      {deal.includedItemsSummary.slice(0, 3).map((inc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B64E35]" />
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/50 block">Combo Price</span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">
                          Rs. {deal.price.toLocaleString()}
                        </span>
                        {deal.originalPrice > deal.price && (
                          <span className="text-xs text-white/40 line-through">
                            Rs. {deal.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModalItem({ item: deal, isDeal: true })}
                      className="bg-white hover:bg-[#FAF8F4] text-[#25231F] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                    >
                      Customize & Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Culinary Story Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Restaurant Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white max-w-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#F5E9E2]">
                Our Philosophy
              </span>
              <p className="font-serif text-lg font-bold mt-1">
                "Pure meat, fresh daily spices, and ancient charcoal smoke."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
                Born in Karachi
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#25231F] mt-1 leading-tight">
                Authentic Craftsmanship, Refined for Modern Connoisseurs
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed">
              At {config.name}, we refuse the modern rush of artificial tenderizers or pre-ground spice mixes. Every morning, our chefs receive fresh grass-fed mutton and premium chicken, grind fresh coriander and roasted cumin, and hand-cut vine tomatoes for cast-iron woks.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2DA]">
                <ShieldCheck className="w-5 h-5 text-[#B64E35] mb-2" />
                <h4 className="font-serif font-bold text-sm text-[#25231F]">
                  100% Fresh Halal
                </h4>
                <p className="text-[11px] text-[#77736D] mt-0.5">
                  Never frozen. Strict daily quality checks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E2DA]">
                <Flame className="w-5 h-5 text-[#B64E35] mb-2" />
                <h4 className="font-serif font-bold text-sm text-[#25231F]">
                  Wild Babool Charcoal
                </h4>
                <p className="text-[11px] text-[#77736D] mt-0.5">
                  Natural hardwood coals for authentic aroma.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('/about')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#B64E35] hover:text-[#9B3F28] transition-colors"
            >
              Read Our Full Story <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Karachi Locations & Branches Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F4] border border-[#E8E2DA] rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
                Coverage & Dine-In
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
                Our Karachi Kitchens
              </h2>
            </div>
            <button
              onClick={openBranchModal}
              className="inline-flex items-center gap-2 bg-white border border-[#E8E2DA] hover:border-[#B64E35]/40 text-[#25231F] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all self-start"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B64E35]" />
              Select Your Kitchen Branch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-2xl p-5 border border-[#E8E2DA] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#B64E35] uppercase tracking-wider">
                    {branch.area}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Open
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#25231F]">
                  {branch.name}
                </h3>
                <p className="text-xs text-[#77736D]">{branch.address}</p>

                <div className="space-y-1 pt-2 border-t border-[#FAF8F4] text-xs text-[#77736D]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B64E35]" />
                    <span>{branch.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B64E35]" />
                    <span>{branch.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Table Reservation Banner (if enabled) */}
      {config.features.reservationsEnabled && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F5E9E2] border border-[#B64E35]/20 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
                Courtyard & Family Dining
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F]">
                Reserve Your Table in Advance
              </h2>
              <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed">
                Hosting a family gathering, birthday celebration, or business dinner? Reserve your seating with ease and let our concierge prepare your table.
              </p>
            </div>

            <button
              onClick={() => navigateTo('/reservation')}
              className="inline-flex items-center gap-2.5 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              Book Table Online
            </button>
          </div>
        </section>
      )}

      {/* Customizer Modal */}
      {activeModalItem && (
        <ProductCustomizerModal
          item={activeModalItem.item}
          isDeal={activeModalItem.isDeal}
          onClose={() => setActiveModalItem(null)}
        />
      )}
    </div>
  );
};
