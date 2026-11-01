import React, { useState } from 'react';
import { QrCode, Copy, Check, Upload, AlertCircle, Smartphone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const UpiPaymentSection = ({
  totalAmount,
  orderNumber = 'NEW-ORDER',
  utr,
  setUtr,
  screenshotUrl,
  setScreenshotUrl,
  qrCodeUrl,
}) => {
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upiId = settings.upiId || 'sweetcakehouse@upi';
  const upiHolder = settings.upiHolderName || 'Sweet Cake House Bakery';

  // Dynamic UPI URI
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    upiHolder
  )}&am=${totalAmount}&tn=${encodeURIComponent(orderNumber)}&cu=INR`;

  // Fallback QR code generator if backend hasn't provided one yet
  const displayQr =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview as data URL for instant feedback
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-rosebakery-100 shadow-soft space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-rosebakery-100">
        <div className="w-10 h-10 rounded-2xl bg-rosebakery-50 text-rosebakery-600 flex items-center justify-center font-bold">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-choco-900">
            Manual UPI Payment (Instant & Secure)
          </h3>
          <p className="text-xs text-choco-500">
            Scan & Pay using Google Pay, PhonePe, Paytm, BHIM, or any banking app
          </p>
        </div>
      </div>

      {/* Amount banner */}
      <div className="bg-cream-100/70 rounded-2xl p-4 flex items-center justify-between border border-cream-200">
        <div>
          <span className="text-xs text-choco-500 block">Total Payable Amount</span>
          <span className="font-serif text-2xl font-black text-rosebakery-600">
            ₹{totalAmount}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-choco-500 block">Bakery UPI ID</span>
          <span className="text-xs font-mono font-bold text-choco-800">{upiId}</span>
        </div>
      </div>

      {/* QR Code and Instructions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* QR Code Box */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-dashed border-rosebakery-200 text-center space-y-3">
          <div className="p-3 bg-white rounded-xl shadow-md border border-cream-200">
            <img
              src={displayQr}
              alt="Sweet Cake House UPI QR"
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-col items-center gap-1.5 w-full">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-choco-50 hover:bg-choco-100 text-choco-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">UPI ID Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy UPI ID ({upiId})</span>
                </>
              )}
            </button>

            {/* Mobile Pay Link */}
            <a
              href={upiUri}
              className="inline-flex items-center gap-1.5 text-xs text-rosebakery-600 font-semibold hover:underline mt-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Tap to open installed UPI App</span>
            </a>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-xs text-choco-700 leading-relaxed">
          <h4 className="font-bold text-choco-900 text-sm">How to complete payment:</h4>
          <ol className="list-decimal list-inside space-y-2 pl-1">
            <li>
              Open any UPI app (<span className="font-semibold">GPay, PhonePe, Paytm</span>).
            </li>
            <li>Scan the QR code above or pay directly to UPI ID <code className="bg-cream-200 px-1 py-0.5 rounded font-mono">{upiId}</code>.</li>
            <li>
              Account Holder: <span className="font-semibold text-choco-900">{upiHolder}</span>.
            </li>
            <li>
              Enter exact amount: <span className="font-bold text-rosebakery-600">₹{totalAmount}</span>.
            </li>
            <li>
              After payment, copy the <span className="font-bold text-choco-900">12-digit UTR / Reference Number</span> from the UPI receipt and paste it below.
            </li>
          </ol>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex gap-2 text-[11px] text-amber-900">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
            <span>
              <strong>Manual Verification:</strong> Your payment will be verified directly in our bank account by the bakery team before kitchen baking starts.
            </span>
          </div>
        </div>
      </div>

      {/* UTR Input & Screenshot */}
      <div className="space-y-4 pt-4 border-t border-rosebakery-100">
        <div>
          <label className="block text-xs font-bold text-choco-900 mb-1.5">
            UPI Transaction Reference Number (UTR / Ref ID) <span className="text-rosebakery-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 430129849201 (12-digit UPI reference)"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-rosebakery-200 focus:border-rosebakery-500 focus:ring-2 focus:ring-rosebakery-200 outline-none text-sm transition-all font-mono"
          />
          <p className="text-[11px] text-choco-400 mt-1">
            Found on your Google Pay, PhonePe, or Paytm successful transaction screen.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-choco-900 mb-1.5">
            Payment Screenshot <span className="text-choco-400 font-normal">(Optional, helps expedite verification)</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-dashed border-rosebakery-300 bg-rosebakery-50 hover:bg-rosebakery-100 text-xs font-semibold text-rosebakery-700 transition-colors">
              <Upload className="w-4 h-4" />
              <span>{screenshotUrl ? 'Change Screenshot' : 'Upload Screenshot'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {screenshotUrl && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Screenshot attached
              </span>
            )}
          </div>
          {screenshotUrl && (
            <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-rosebakery-200">
              <img src={screenshotUrl} alt="Payment Proof" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentSection;

