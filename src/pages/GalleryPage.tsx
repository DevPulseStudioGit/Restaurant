import React, { useState } from 'react';
import { galleryItems } from '../data/initialData';
import { X, ZoomIn, Eye } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<{
    id: string;
    title: string;
    category: string;
    image: string;
    caption: string;
  } | null>(null);

  const categories = ['All', 'Kitchen & Craft', 'BBQ & Fire', 'Heritage Rice', 'Ambience', 'Desserts'];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Visual Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#25231F]">
          Food, Fire & Ambience Gallery
        </h1>
        <p className="text-xs sm:text-sm text-[#77736D]">
          A visual glimpse into our open-flame kitchens, clay-pot curries, hand-stretched tandoori breads, and courtyard evenings.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#B64E35] text-white shadow-xs'
                : 'bg-white text-[#77736D] border border-[#E8E2DA] hover:text-[#25231F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group relative rounded-3xl overflow-hidden aspect-4/3 bg-[#FAF8F4] border border-[#E8E2DA] cursor-pointer shadow-2xs hover:border-[#B64E35]/40 transition-all duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white" />

            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white pointer-events-none">
              <div className="self-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <ZoomIn className="w-4 h-4 text-white" />
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#F5E9E2] font-semibold">
                  {item.category}
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-[#26231F] rounded-3xl overflow-hidden shadow-2xl border border-white/10 text-white">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 space-y-1.5 bg-[#26231F]">
              <span className="text-xs uppercase tracking-wider text-[#B64E35] font-semibold">
                {lightboxItem.category}
              </span>
              <h3 className="font-serif font-bold text-2xl text-white">
                {lightboxItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/70">
                {lightboxItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
