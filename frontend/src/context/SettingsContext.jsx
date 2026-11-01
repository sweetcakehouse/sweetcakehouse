import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSettings } from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    shopName: 'Sweet Cake House',
    tagline: 'Handcrafted with Love, Baked to Perfection',
    shopAddress: 'Shop 14, Rose Villa Arcade, Baker Street, Blossom City',
    city: 'Mumbai',
    phone: '+91 98765 43210',
    whatsappNumber: '919876543210',
    email: 'orders@sweetcakehouse.com',
    upiId: 'sweetcakehouse@upi',
    upiHolderName: 'Sweet Cake House Bakery',
    upiQrImage: '',
    paymentInstructions:
      '1. Scan the QR code or pay to the UPI ID directly.\n2. In the remarks/note, please write your Order ID.\n3. Enter the 12-digit UPI UTR / Ref Number below and submit your order.\n4. Our team will verify the payment and confirm your delivery!',
    deliveryCharge: 50,
    freeDeliveryAbove: 999,
    minOrderAmount: 200,
    businessHours: '09:00 AM - 10:30 PM (Everyday)',
    availableTimeSlots: [
      'Morning (09:00 AM - 01:00 PM)',
      'Afternoon (01:00 PM - 05:00 PM)',
      'Evening (05:00 PM - 09:00 PM)',
      'Midnight Special (11:00 PM - 12:00 AM)',
    ],
  });
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const res = await fetchSettings();
      if (res.data && res.data.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.warn('Using default settings fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, reloadSettings: loadSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

