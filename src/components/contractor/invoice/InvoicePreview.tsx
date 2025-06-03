'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface InvoicePreviewProps {
  data: any;
  onPrev: () => void;
  onSubmit: () => void;
}

export default function InvoicePreview({ data, onPrev, onSubmit }: InvoicePreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <DocumentTextIcon className="h-6 w-6 mr-2" />
        Invoice Preview & Submit
      </h2>
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Invoice preview section coming soon...</p>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <button onClick={onPrev} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Previous
        </button>
        <button onClick={onSubmit} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          Submit Invoice
        </button>
      </div>
    </div>
  );
} 