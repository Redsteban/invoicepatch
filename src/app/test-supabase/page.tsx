import SupabaseTest from '@/components/SupabaseTest';

export default function TestSupabasePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            InvoicePatch Supabase Integration Test
          </h1>
          <p className="text-gray-600">
            Test your database connection and perform CRUD operations
          </p>
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            ⚠️ This is a development testing page. Remove from production.
          </div>
        </div>
        
        <SupabaseTest />
        
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
} 