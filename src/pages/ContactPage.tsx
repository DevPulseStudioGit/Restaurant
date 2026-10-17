import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StorageService } from '../services/storage';
import { CustomerInquiry } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { config, showToast } = useRestaurant();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappUrl = `https://wa.me/${config.whatsappNumber.replace(/[\s\-\+]/g, '')}?text=Hello%20${encodeURIComponent(config.name)}%2C%20I%20have%20an%20inquiry.`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: CustomerInquiry = {
        id: `inq-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'new',
      };

      StorageService.createInquiry(newInquiry);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Inquiry submitted. Our concierge will contact you shortly.', 'success');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B64E35]">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#25231F]">
          Contact Our Concierge
        </h1>
        <p className="text-xs sm:text-sm text-[#77736D]">
          Whether inquiring about event catering, sharing feedback, or seeking immediate order assistance, we are at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Contact Info & WhatsApp */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
            <h2 className="font-serif font-bold text-xl text-[#25231F]">
              Direct Contact Channels
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#F5E9E2] text-[#B64E35] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#77736D] block text-xs">Direct Telephone</span>
                  <a href={`tel:${config.contactPhone}`} className="font-semibold text-[#25231F] hover:text-[#B64E35]">
                    {config.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#F5E9E2] text-[#B64E35] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#77736D] block text-xs">Email Concierge</span>
                  <a href={`mailto:${config.email}`} className="font-semibold text-[#25231F] hover:text-[#B64E35]">
                    {config.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#F5E9E2] text-[#B64E35] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#77736D] block text-xs">Central Office & Flagship</span>
                  <p className="font-medium text-[#25231F] leading-snug">
                    {config.headquartersAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#F5E9E2] text-[#B64E35] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#77736D] block text-xs">Kitchen & Service Timings</span>
                  <p className="font-medium text-[#25231F]">
                    {config.openingHoursSummary}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold py-3.5 rounded-xl transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Manager on WhatsApp ({config.whatsappNumber})
              </a>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 shadow-2xs">
          <h2 className="font-serif font-bold text-xl text-[#25231F] mb-4">
            Send Us an Inquiry
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#25231F]">
                Message Received
              </h3>
              <p className="text-xs sm:text-sm text-[#77736D] max-w-sm mx-auto">
                Thank you for contacting us. Your message has been routed to our operations team. We will get in touch shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                  setSubject('');
                }}
                className="bg-[#B64E35] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                    Your Name <span className="text-[#B64E35]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bilal Ahmed"
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                    Phone Number <span className="text-[#B64E35]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Subject / Topic <span className="text-[#B64E35]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Outdoor Catering, Feedback, Order Question"
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#77736D] uppercase tracking-wider block">
                  Message <span className="text-[#B64E35]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full bg-[#FAF8F4] border border-[#E8E2DA] rounded-xl p-3 text-xs sm:text-sm text-[#25231F] focus:outline-none focus:border-[#B64E35] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#B64E35] hover:bg-[#9B3F28] text-white text-xs sm:text-sm font-semibold py-3.5 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
