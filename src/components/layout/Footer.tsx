import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Flame,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { config, branches, navigateTo } = useRestaurant();

  const handleNav = (path: string) => {
    navigateTo(path);
  };

  const whatsappUrl = `https://wa.me/${config.whatsappNumber.replace(/[\s\-\+]/g, '')}?text=Hello%20${encodeURIComponent(config.name)}%2C%20I%20would%20like%20to%20inquire%20about%20ordering.`;

  return (
    <footer className="bg-[#26231F] text-[#FAF8F4] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand Story & WhatsApp CTA */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#B64E35] flex items-center justify-center text-white">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  {config.name}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-white/50 font-medium">
                  {config.cuisineType}
                </span>
              </div>
            </div>

            <p className="text-sm text-white/70 leading-relaxed max-w-md">
              {config.brandStory}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Direct: {config.whatsappNumber}
              </a>

              <a
                href={`tel:${config.contactPhone}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4 text-[#B64E35]" />
                Call Hotline
              </a>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#B64E35] font-semibold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <button onClick={() => handleNav('/')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/menu')} className="hover:text-white transition-colors">
                  Full Menu & Ordering
                </button>
              </li>
              {config.features.dealsEnabled && (
                <li>
                  <button onClick={() => handleNav('/deals')} className="hover:text-white transition-colors">
                    Deals & Combos
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-white transition-colors">
                  Our Culinary Story
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/gallery')} className="hover:text-white transition-colors">
                  Food & Ambience Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/locations')} className="hover:text-white transition-colors">
                  Branches & Coverage
                </button>
              </li>
              {config.features.reservationsEnabled && (
                <li>
                  <button onClick={() => handleNav('/reservation')} className="hover:text-white transition-colors">
                    Table Reservations
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Branches & Hours */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#B64E35] font-semibold">
              Karachi Branches
            </h4>
            <div className="space-y-3 text-xs text-white/70">
              {branches.map((branch) => (
                <div key={branch.id} className="border-l-2 border-[#B64E35] pl-3 py-0.5">
                  <div className="font-semibold text-white">{branch.name}</div>
                  <div className="text-white/60 truncate max-w-[200px]">{branch.address}</div>
                  <div className="text-[11px] text-white/40 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {branch.hours}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 5: Help & Policies */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#B64E35] font-semibold">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <button onClick={() => handleNav('/track-order')} className="hover:text-white transition-colors flex items-center gap-1">
                  Track Live Order <ArrowUpRight className="w-3 h-3 text-[#B64E35]" />
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-white transition-colors">
                  Contact Concierge
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/delivery-policy')} className="hover:text-white transition-colors">
                  Delivery Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/privacy-policy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} {config.name}. All rights reserved. Registered in Karachi, Pakistan.
          </div>
          <div className="flex items-center gap-4">
            <span>Fresh Halal Guaranteed</span>
            <span>·</span>
            <button
              onClick={() => handleNav('/admin')}
              className="text-white/40 hover:text-white/80 transition-colors"
              title="Restaurant Operations Portal"
            >
              Staff
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
