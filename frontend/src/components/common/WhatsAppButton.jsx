import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const WhatsAppButton = () => {
  const { settings } = useSettings();
  const cleanWhatsAppNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');

  const defaultMessage = `Hi ${settings.shopName}! I would like to order a fresh artisanal cake.`;

  return (
    <aside aria-label="Support and Ordering" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(defaultMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order or Chat on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          Order on WhatsApp
        </span>
      </a>
    </aside>
  );
};

export default WhatsAppButton;

