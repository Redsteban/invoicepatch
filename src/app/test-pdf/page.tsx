"use client";
import PDFDownloader from '../../components/PDFDownloader';
import EmailDebugger from '../../components/EmailDebugger';

export default function TestPDFPage() {
  // Sample simulation data for testing
  const sampleSimulationData = {
    contractorName: 'John Smith Contracting',
    clientName: 'Shell Canada Energy',
    startDate: '2024-12-01',
    endDate: '2024-12-14',
    entries: [
      {
        date: '2024-12-01',
        regularHours: 8,
        overtimeHours: 0,
        workDescription: 'Site inspection and equipment setup',
        completed: true
      },
      {
        date: '2024-12-02',
        regularHours: 8,
        overtimeHours: 2,
        workDescription: 'Drilling operations and maintenance',
        completed: true
      },
      {
        date: '2024-12-03',
        regularHours: 6,
        overtimeHours: 4,
        workDescription: 'Emergency repair work',
        completed: true
      },
      {
        date: '2024-12-04',
        regularHours: 8,
        overtimeHours: 1,
        workDescription: 'Quality control and documentation',
        completed: true
      },
      {
        date: '2024-12-05',
        regularHours: 8,
        overtimeHours: 0,
        workDescription: 'Regular operations and monitoring',
        completed: true
      }
    ]
  };

  const handleDownloadComplete = () => {
    console.log('PDF download completed successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Download Test</h1>
          <p className="text-gray-600">Test the PDF invoice generation functionality</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sample Data Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sample Data</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Contractor:</span> {sampleSimulationData.contractorName}
              </div>
              <div>
                <span className="font-medium">Client:</span> {sampleSimulationData.clientName}
              </div>
              <div>
                <span className="font-medium">Period:</span> {sampleSimulationData.startDate} to {sampleSimulationData.endDate}
              </div>
              <div>
                <span className="font-medium">Completed Days:</span> {sampleSimulationData.entries.filter(e => e.completed).length}
              </div>
            </div>

            <h3 className="font-bold mt-6 mb-3">Daily Entries:</h3>
            <div className="space-y-2">
              {sampleSimulationData.entries.map((entry, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                  <div className="font-medium">{entry.date}</div>
                  <div>Regular: {entry.regularHours}h | OT: {entry.overtimeHours}h</div>
                  <div className="text-gray-600">{entry.workDescription}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Downloader */}
          <div>
            <PDFDownloader 
              simulationData={sampleSimulationData}
              onDownloadComplete={handleDownloadComplete}
            />
          </div>
        </div>

        {/* Email Debugger for API testing */}
        <div className="mt-8">
          <EmailDebugger />
        </div>

        {/* Browser Compatibility Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">Browser Compatibility Notes:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• PDF downloads work in all modern browsers</li>
            <li>• If download doesn't start automatically, check your browser's download settings</li>
            <li>• Some browsers may block automatic downloads - allow them when prompted</li>
            <li>• PDF will be saved to your default Downloads folder</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 