import React, { useState } from 'react';
import { faqItems } from '../data/initialData';
import { useRestaurant } from '../context/RestaurantContext';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { config } = useRestaurant();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Customer Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#25231F]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#77736D]">
          Answers to common questions regarding delivery zones, packaging, food preparation, and booking.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqItems.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E8E2DA] overflow-hidden transition-all shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#FAF8F4]/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div>
                  <span className="text-[11px] font-semibold text-[#B64E35] uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#25231F]">
                    {item.question}
                  </h3>
                </div>
                <div
                  className={`w-7 h-7 rounded-full bg-[#FAF8F4] flex items-center justify-center shrink-0 text-[#77736D] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#F5E9E2] text-[#B64E35]' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#77736D] leading-relaxed border-t border-[#FAF8F4] pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help Banner */}
      <div className="p-6 bg-[#F5E9E2] rounded-3xl border border-[#B64E35]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h4 className="font-serif font-bold text-lg text-[#25231F]">
            Have a question not listed here?
          </h4>
          <p className="text-xs text-[#77736D] mt-0.5">
            Our hotline team is available daily from 12:30 PM to 01:30 AM.
          </p>
        </div>
        <a
          href={`https://wa.me/${config.whatsappNumber.replace(/[\s\-\+]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shadow-xs shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};
