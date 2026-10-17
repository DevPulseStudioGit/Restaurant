import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Flame, ShieldCheck, Heart, Award, Users, Utensils, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { config, navigateTo } = useRestaurant();

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* Editorial Hero */}
      <section className="relative bg-[#26231F] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#B64E35_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#F5E9E2]">
            Culinary Heritage & Passion
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white">
            Honoring the Soul of Karachi's Fire & Smoke
          </h1>
          <p className="text-xs sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed font-sans">
            A story shaped by wood-fired clay ovens, cast-iron woks, and the timeless warmth of authentic Pakistani hospitality.
          </p>
        </div>
      </section>

      {/* Main Story Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
              The Genesis
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#25231F] leading-tight">
              Where Ancient Charcoal Grilling Meets Contemporary Refinement
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#77736D] leading-relaxed">
              <p>
                Karachi has always been a city intoxicated by the scent of night food streets—where coal smoke mingles with salty sea air, and families gather around sizzling cast-iron karahis into the small hours of the morning.
              </p>
              <p>
                {config.name} was established with one uncompromising mandate: to take the irreplaceable flavors of traditional roadside sigri BBQ and Shinwari meat cooking, and present them with artisanal precision, immaculate hygiene, and warm, unhurried service.
              </p>
              <p>
                We do not believe in synthetic flavor powders, commercial sauces, or shortcuts. Our slow-simmered gravies develop depth over gentle coal embers, and our meat is procured fresh each sunrise.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('/menu')}
                className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all"
              >
                <span>Taste Our Craft</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl overflow-hidden aspect-4/5 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80"
                alt="Karahi Simmering"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden aspect-4/5 shadow-md mt-8">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                alt="Charcoal BBQ"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F4] border border-[#E8E2DA] rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
              Uncompromising Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F]">
              The Three Pillars of Our Kitchen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DA] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5E9E2] text-[#B64E35] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#25231F]">
                1. Pure Ingredients
              </h3>
              <p className="text-xs text-[#77736D] leading-relaxed">
                Fresh mutton and farm poultry, whole mustard oils, unbleached flour, cold-pressed dairy ghee, and whole spices ground in-house.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DA] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5E9E2] text-[#B64E35] flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#25231F]">
                2. Live Wood Fire
              </h3>
              <p className="text-xs text-[#77736D] leading-relaxed">
                We refuse electric grills or gas salamanders for our BBQ. Only wild babool hardwood coals impart the genuine aroma our patrons love.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DA] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5E9E2] text-[#B64E35] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#25231F]">
                3. Karachi Hospitality
              </h3>
              <p className="text-xs text-[#77736D] leading-relaxed">
                Whether enjoying courtyard dining under soft lanterns or unboxing thermal-sealed delivery at your family dastarkhwan, your delight is our pride.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
