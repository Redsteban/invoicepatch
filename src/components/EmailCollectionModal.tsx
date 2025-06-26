'use client';
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface EmailCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: any;
}

export default function EmailCollectionModal({ isOpen, onClose, invoiceData }: EmailCollectionModalProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalTop, setModalTop] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      // On open, set modal top to current scroll position + 32px (for spacing)
      const updateTop = () => {
        if (window.innerWidth < 640) {
          setModalTop(window.scrollY + 32);
        } else {
          setModalTop(null); // Center on desktop
        }
      };
      updateTop();
      window.addEventListener('scroll', updateTop);
      window.addEventListener('resize', updateTop);
      return () => {
        window.removeEventListener('scroll', updateTop);
        window.removeEventListener('resize', updateTop);
      };
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('📧 Sending email with data:', { email, invoiceData, consent });

      const response = await fetch('/api/email/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          invoiceData,
          consent
        }),
      });

      console.log('📨 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Success:', result);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);

    } catch (err: any) {
      console.error('💥 Email error:', err);
      setError(err.message || 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Handler to close modal when clicking the overlay (but not the modal itself)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={handleOverlayClick}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md mx-auto p-4 sm:p-6 relative shadow-lg max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Get Your Invoice Modal"
        style={{
          position: 'absolute',
          top: modalTop !== null ? modalTop : window.scrollY + 32,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📧 Get Your Invoice</h2>
        
        {success ? (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Email Sent!</h3>
            <p className="text-gray-600">Check your inbox for the invoice PDF.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 mr-2"
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                I'd like to receive updates about InvoicePatch
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Sending...' : 'Send Invoice'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 