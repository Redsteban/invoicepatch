import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice Setup - Start Your Trial | InvoicePatch',
  description: 'Set up your invoice details to begin automated daily check-ins and streamlined billing with InvoicePatch.',
};

export default function TrialSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header for trial setup */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IP</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">InvoicePatch</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Setting up your trial
              </span>
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Page content */}
      <main className="mobile-container">
        {children}
      </main>
      
      {/* Simple footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>Need help? Contact us at <a href="mailto:support@invoicepatch.com" className="text-blue-600 hover:text-blue-700">support@invoicepatch.com</a></p>
            <p className="mt-2">&copy; 2024 InvoicePatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 