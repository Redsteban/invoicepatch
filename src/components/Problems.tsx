import {
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  EyeSlashIcon,
  CalendarDaysIcon,
  DocumentMagnifyingGlassIcon,
  ComputerDesktopIcon,
  ChatBubbleLeftRightIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';

const contractorProblems = [
  {
    icon: CurrencyDollarIcon,
    title: 'Missing invoice deadlines costs you $200-500 per missed payment',
    description: 'Every late submission means delayed cash flow and potential contract penalties.',
    impact: '$200-500 lost per incident',
  },
  {
    icon: DocumentTextIcon,
    title: 'Manual tracking leads to forgotten charges and lost receipts',
    description: 'Sticky notes and photos scattered across your phone - important billable hours slip through the cracks.',
    impact: '15-20% revenue loss',
  },
  {
    icon: ClockIcon,
    title: 'Late submissions delay your paycheck by weeks',
    description: 'While you wait for approval cycles, your bills keep coming and cash flow suffers.',
    impact: '2-4 week delays',
  },
  {
    icon: ExclamationTriangleIcon,
    title: 'GST/PST calculations are confusing and error-prone',
    description: 'Tax mistakes can trigger audits and costly penalties from the CRA.',
    impact: 'Audit risk & penalties',
  },
  {
    icon: EyeSlashIcon,
    title: 'No visibility into invoice status or payment timeline',
    description: 'You submit invoices into a black hole with no idea when you\'ll get paid.',
    impact: 'Cash flow uncertainty',
  },
];

const managerProblems = [
  {
    icon: CalendarDaysIcon,
    title: '8-12 hours every weekend processing contractor invoices',
    description: 'Your weekends disappear into spreadsheets, email chains, and manual data entry.',
    impact: '8-12 hours weekly',
  },
  {
    icon: DocumentMagnifyingGlassIcon,
    title: 'Chasing missing documentation and correcting errors',
    description: 'Constant back-and-forth with contractors to get complete, accurate submissions.',
    impact: '40% require follow-up',
  },
  {
    icon: ComputerDesktopIcon,
    title: 'Manual data entry into accounting systems',
    description: 'Copy-pasting invoice details increases errors and wastes valuable time.',
    impact: '3-5 minutes per invoice',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Dealing with contractor complaints about late payments',
    description: 'Frustrated contractors calling about payment status you can\'t easily track.',
    impact: 'Relationship strain',
  },
  {
    icon: ShieldExclamationIcon,
    title: 'Compliance headaches with Canadian tax requirements',
    description: 'Ensuring HST/GST compliance across provinces while managing deadlines.',
    impact: 'Audit exposure',
  },
];

export default function Problems() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">The Hidden Costs</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            How Much is Manual Invoicing Really Costing You?
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Every week, Canadian contractors and their managers lose thousands of dollars and countless hours 
            to an outdated, manual invoicing process.
          </p>
        </div>

        {/* Contractor Problems */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-blue-50 rounded-full p-3 mr-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">If You&apos;re a Contractor...</h3>
          </div>
          
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {contractorProblems.slice(0, 3).map((problem, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="bg-gray-50 rounded-lg p-3 w-fit mb-4 group-hover:bg-blue-50 transition-colors">
                  <problem.icon className="h-6 w-6 text-blue-600" />
                </div>
                
                <h4 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                  {problem.title}
                </h4>
                
                <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                  {problem.description}
                </p>
                
                <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                  <span className="text-slate-700 font-semibold text-sm">
                    💸 Impact: {problem.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - 2 cards centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {contractorProblems.slice(3, 5).map((problem, index) => (
                <div
                  key={index + 3}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="bg-gray-50 rounded-lg p-3 w-fit mb-4 group-hover:bg-blue-50 transition-colors">
                    <problem.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                    {problem.title}
                  </h4>
                  
                  <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                    {problem.description}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                    <span className="text-slate-700 font-semibold text-sm">
                      💸 Impact: {problem.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Manager Problems */}
        <div>
          <div className="flex items-center justify-center mb-12">
            <div className="bg-blue-50 rounded-full p-3 mr-4">
              <ComputerDesktopIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">If You&apos;re a Manager...</h3>
          </div>
          
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {managerProblems.slice(0, 3).map((problem, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="bg-gray-50 rounded-lg p-3 w-fit mb-4 group-hover:bg-blue-50 transition-colors">
                  <problem.icon className="h-6 w-6 text-blue-600" />
                </div>
                
                <h4 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                  {problem.title}
                </h4>
                
                <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                  {problem.description}
                </p>
                
                <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                  <span className="text-slate-700 font-semibold text-sm">
                    ⏰ Cost: {problem.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - 2 cards centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {managerProblems.slice(3, 5).map((problem, index) => (
                <div
                  key={index + 3}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="bg-gray-50 rounded-lg p-3 w-fit mb-4 group-hover:bg-blue-50 transition-colors">
                    <problem.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                    {problem.title}
                  </h4>
                  
                  <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                    {problem.description}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                    <span className="text-slate-700 font-semibold text-sm">
                      ⏰ Cost: {problem.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Sound Familiar? You&apos;re Not Alone.
            </h3>
            <p className="text-slate-600 mb-4">
              Over 10,000 Canadian contractors and managers deal with these exact problems every week.
            </p>
            <p className="text-blue-600 font-semibold">
              But what if there was a better way?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 