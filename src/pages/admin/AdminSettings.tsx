import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { StorageService } from '../../services/storage';
import { RestaurantConfig } from '../../types';
import { Save, RotateCcw, Palette, Sliders, Phone, MapPin, Store, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { config, showToast } = useRestaurant();

  const [formData, setFormData] = useState<RestaurantConfig>(() => ({ ...config }));
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof RestaurantConfig, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setIsSaved(false);
  };

  const handleFeatureToggle = (feature: keyof RestaurantConfig['features']) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
    setIsSaved(false);
  };

  const handlePricingChange = (key: keyof RestaurantConfig['pricing'], val: number) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [key]: val,
      },
    }));
    setIsSaved(false);
  };

  const handleThemeChange = (key: keyof RestaurantConfig['theme'], val: string) => {
    setFormData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: val,
      },
    }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateConfig(formData);
    setIsSaved(true);
    showToast('Restaurant brand settings and theme saved.', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
            Agency Customization
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#25231F] mt-1">
            Website & Brand Settings
          </h1>
          <p className="text-xs text-[#77736D] mt-0.5">
            Configure this website system for any restaurant client in minutes.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-colors self-start"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Settings saved! Changes are now reflected live across all pages.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Brand Identity */}
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#FAF8F4]">
            <Store className="w-5 h-5 text-[#B64E35]" />
            <h2 className="font-serif font-bold text-lg text-[#25231F]">
              1. Restaurant Brand & Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Restaurant Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-2.5 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Cuisine Type
              </label>
              <input
                type="text"
                value={formData.cuisineType}
                onChange={(e) => handleChange('cuisineType', e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-2.5 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-2.5 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Brand Story (Shown on homepage & footer)
              </label>
              <textarea
                rows={3}
                value={formData.brandStory}
                onChange={(e) => handleChange('brandStory', e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-3 text-[#25231F] focus:outline-none focus:border-[#B64E35] resize-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact & Headquarters */}
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#FAF8F4]">
            <Phone className="w-5 h-5 text-[#B64E35]" />
            <h2 className="font-serif font-bold text-lg text-[#25231F]">
              2. Contact Information & Hours
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Hotline Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                WhatsApp Direct Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Concierge Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Headquarters Address
              </label>
              <input
                type="text"
                value={formData.headquartersAddress}
                onChange={(e) => handleChange('headquartersAddress', e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Opening Hours Summary
              </label>
              <input
                type="text"
                value={formData.openingHoursSummary}
                onChange={(e) => handleChange('openingHoursSummary', e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-[#25231F] focus:outline-none focus:border-[#B64E35]"
              />
            </div>
          </div>
        </div>

        {/* 3. Feature Flags */}
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#FAF8F4]">
            <Sliders className="w-5 h-5 text-[#B64E35]" />
            <h2 className="font-serif font-bold text-lg text-[#25231F]">
              3. Enabled Restaurant Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'deliveryEnabled', label: 'Online Home Delivery' },
              { id: 'pickupEnabled', label: 'Takeaway / Pick-Up Ordering' },
              { id: 'reservationsEnabled', label: 'Table Reservations' },
              { id: 'dealsEnabled', label: 'Deals & Combos Page' },
              { id: 'onlinePaymentEnabled', label: 'Bank Transfer & Card Options' },
              { id: 'branchSelectionEnabled', label: 'Branch & Area Selection' },
            ].map((f) => {
              const isChecked = (formData.features as any)[f.id];
              return (
                <div
                  key={f.id}
                  onClick={() => handleFeatureToggle(f.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-[#F5E9E2]/60 border-[#B64E35]'
                      : 'bg-white border-[#E8E2DA]'
                  }`}
                >
                  <span className="text-xs font-semibold text-[#25231F]">{f.label}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      isChecked
                        ? 'bg-[#B64E35] border-[#B64E35] text-white'
                        : 'border-[#E8E2DA]'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Theme Colors */}
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#FAF8F4]">
            <Palette className="w-5 h-5 text-[#B64E35]" />
            <h2 className="font-serif font-bold text-lg text-[#25231F]">
              4. Visual Identity & Color Palette
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Primary Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-[#E8E2DA]"
                />
                <input
                  type="text"
                  value={formData.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Hover State Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.theme.primaryHover}
                  onChange={(e) => handleThemeChange('primaryHover', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-[#E8E2DA]"
                />
                <input
                  type="text"
                  value={formData.theme.primaryHover}
                  onChange={(e) => handleThemeChange('primaryHover', e.target.value)}
                  className="bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#77736D] uppercase block">
                Page Background
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.theme.backgroundColor}
                  onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-[#E8E2DA]"
                />
                <input
                  type="text"
                  value={formData.theme.backgroundColor}
                  onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                  className="bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-xl shadow-xs transition-colors"
          >
            Save All Restaurant Settings
          </button>
        </div>
      </form>
    </div>
  );
};
