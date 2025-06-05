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
    title: 'Missing service company invoice deadlines costs you $500-1000 per missed payment',
    description: 'Every late submission to drilling companies or service companies means delayed cash flow and potential contract penalties. Field schedules wait for no one.',
    impact: '$500-1000 lost per incident',
  },
  {
    icon: DocumentTextIcon,
    title: 'Tracking AFE codes, well IDs, and per-foot rates manually leads to billing errors',
    description: 'Juggling multiple AFE numbers, well locations, and service types across your phone and notebook - important billable hours and equipment charges slip through the cracks.',
    impact: '15-25% revenue loss',
  },
  {
    icon: ClockIcon,
    title: 'Late submissions to service companies delay your paycheck by weeks',
    description: 'While you wait for approval from drilling supervisors and project managers, your equipment payments and crew wages keep coming due.',
    impact: '2-6 week delays',
  },
  {
    icon: ExclamationTriangleIcon,
    title: 'HST/PST on equipment vs services is confusing and audit-prone',
    description: 'Different tax rates for equipment rental vs services, plus per diems and travel allowances from remote sites create compliance nightmares.',
    impact: 'CRA audit risk & penalties',
  },
  {
    icon: EyeSlashIcon,
    title: 'No visibility into invoice status with drilling companies',
    description: 'You submit invoices to service companies and drilling contractors with no idea where they are in the approval chain or when you\'ll get paid.',
    impact: 'Cash flow uncertainty',
  },
];

const managerProblems = [
  {
    icon: CalendarDaysIcon,
    title: '8-15 hours every weekend processing oilfield contractor invoices',
    description: 'Your weekends disappear into spreadsheets reconciling wireline, coil tubing, frac crew, and drilling contractor invoices with field reports.',
    impact: '8-15 hours weekly',
  },
  {
    icon: DocumentMagnifyingGlassIcon,
    title: 'Chasing missing AFE codes, well IDs, and service documentation',
    description: 'Constant back-and-forth with pressure pumping crews, directional drillers, and consultants to get complete, accurate submissions with correct well names.',
    impact: '50% require follow-up',
  },
  {
    icon: ComputerDesktopIcon,
    title: 'Manual data entry into FieldCap, FireSpark, and field management systems',
    description: 'Copy-pasting invoice details from service contractors into multiple systems increases errors and wastes valuable time during critical operations.',
    impact: '5-8 minutes per invoice',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Dealing with service contractor complaints about late payments',
    description: 'Frustrated drilling contractors, mud loggers, and consultants calling about payment status you can\'t easily track across multiple AFEs.',
    impact: 'Vendor relationship strain',
  },
  {
    icon: ShieldExclamationIcon,
    title: 'Compliance headaches with equipment vs service tax requirements',
    description: 'Ensuring HST/GST compliance on equipment rental vs services across provinces while managing per diems and remote site allowances.',
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
            Every week, Canadian oil & gas contractors and their managers lose thousands of dollars and countless hours 
            to an outdated, manual invoicing process.
          </p>
        </div>

        {/* Contractor Problems */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-blue-50 rounded-full p-3 mr-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">If You&apos;re an Oilfield Contractor...</h3>
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
            <h3 className="text-2xl font-bold text-slate-800">If You&apos;re an Operations Manager...</h3>
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
              Over 10,000 Canadian oil & gas contractors and managers deal with these exact problems every week.
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