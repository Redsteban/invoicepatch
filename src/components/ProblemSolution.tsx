import { 
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const managerProblems = [
  {
    title: "Contractor says Project ABC, your system shows XYZ-789",
    description: "Every invoice becomes a detective game. Which project code did they actually mean? You spend time cross-referencing their descriptions with your system.",
    icon: DocumentDuplicateIcon,
    stat: "85% of invoices have mismatched codes"
  },
  {
    title: "They charge $400/day, approved rate is $450/day",
    description: "Contractors undercharge because they don't have access to your current rate cards. You catch the error, but now you need to go back and forth to fix it.",
    icon: CurrencyDollarIcon,
    stat: "15-20% revenue lost to undercharging"
  },
  {
    title: "Missing work days that are tracked in your system",
    description: "Your system shows contractor worked Tuesday and Thursday, but their invoice only shows Tuesday. Time to dig through records and make phone calls.",
    icon: ClockIcon,
    stat: "30% of billable time missed"
  },
  {
    title: "8+ hours weekly correlating their data with yours",
    description: "Friday afternoon becomes reconciliation hell. Line by line, invoice by invoice, checking their submissions against your project management system.",
    icon: ExclamationTriangleIcon,
    stat: "Managers report 8-12 hours weekly"
  }
];

const contractorProblems = [
  {
    title: "Guessing at project codes and missing charges",
    description: "You know you worked on the Johnson kitchen reno, but what's the actual project code? Was it residential or commercial billing? Guess wrong, get paid wrong.",
    icon: DocumentDuplicateIcon,
    stat: "Average 2-3 billing errors per invoice"
  },
  {
    title: "No access to client's approved rates and work orders",
    description: "Did the overtime rate change? Are materials billable on this project? You're working blind without access to the client's current project data.",
    icon: EyeIcon,
    stat: "40% unsure of current rates"
  },
  {
    title: "Late submissions because you forgot deadlines",
    description: "Different clients want invoices on different schedules. Was this one due on the 15th or 30th? Late invoices mean delayed payments.",
    icon: ClockIcon,
    stat: "25% of contractors miss deadlines"
  },
  {
    title: "Tax paperwork chaos across multiple clients",
    description: "HST for Ontario client, PST+GST for BC client, different rates for different provinces. Tax season becomes a nightmare of spreadsheets.",
    icon: ExclamationTriangleIcon,
    stat: "Hours of tax reconciliation"
  }
];

const solutions = [
  {
    title: "Work order data syncs directly to contractor apps",
    description: "Project codes, locations, rates, and deadlines flow automatically from your system to their mobile app. No more guessing games.",
    icon: ArrowPathIcon,
    stat: "100% data accuracy"
  },
  {
    title: "Pre-filled invoices with validated information",
    description: "Contractors submit invoices that are already populated with your exact project data. They just add hours and hit submit.",
    icon: CheckCircleIcon,
    stat: "90% reduction in errors"
  },
  {
    title: "One-click approval since everything matches",
    description: "No more line-by-line checking. Since the data came from your system, you can approve with confidence in seconds.",
    icon: EyeIcon,
    stat: "95% faster approvals"
  },
  {
    title: "Real-time visibility into project costs",
    description: "See hours logged and costs incurred in real-time. No more surprises when invoices arrive at month-end.",
    icon: CurrencyDollarIcon,
    stat: "Live budget tracking"
  }
];

export default function ProblemSolution() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Problems Section */}
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-gray-600">The Reconciliation Problem</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            The Same Data Lives in Two Different Places
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Managers have project data in their system. Contractors recreate it manually. 
            This disconnect creates errors, delays, and wasted time for everyone.
          </p>
        </div>

        {/* Manager Problems */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <UserGroupIcon className="h-8 w-8 text-gray-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              Manager Pain Points
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {managerProblems.map((problem, index) => (
              <div key={index} className="relative rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <problem.icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      "{problem.title}"
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {problem.description}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {problem.stat}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contractor Problems */}
        <div className="mb-24">
          <div className="flex items-center mb-8">
            <UserIcon className="h-8 w-8 text-gray-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              Contractor Pain Points
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contractorProblems.map((problem, index) => (
              <div key={index} className="relative rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <problem.icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      "{problem.title}"
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {problem.description}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {problem.stat}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solution Section */}
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">The Sync Solution</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            One Source of Truth for Everyone
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            InvoicePatch connects your system directly to contractor apps. 
            Same data, same format, zero reconciliation needed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <div key={index} className="relative rounded-xl bg-white p-6 shadow-sm border border-emerald-200 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                    <solution.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {solution.title}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {solution.description}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    {solution.stat}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Solution Workflow */}
        <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How Data Sync Works
          </h3>
          
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Work Order</h4>
              <p className="text-sm text-gray-600">Manager creates work order in QuickBooks/Sage/Xero with project codes, rates, locations</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:block">
              <ArrowPathIcon className="h-8 w-8 text-emerald-600" />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Sync</h4>
              <p className="text-sm text-gray-600">Work order data appears instantly in contractor's mobile app with all details</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:block">
              <ArrowPathIcon className="h-8 w-8 text-emerald-600" />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                <span className="text-2xl font-bold text-gray-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Pre-filled Invoice</h4>
              <p className="text-sm text-gray-600">Contractor submits invoice with your exact data - just adds hours and submits</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:block">
              <ArrowPathIcon className="h-8 w-8 text-emerald-600" />
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
                <span className="text-2xl font-bold text-emerald-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">One-Click Approve</h4>
              <p className="text-sm text-gray-600">Perfect match = instant approval. No reconciliation needed</p>
            </div>
          </div>
        </div>

        {/* ROI Section */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-8 py-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Stop the Reconciliation Madness
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              See exactly how data sync will work with your specific system
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-500">
                Schedule Demo Call
              </button>
              <button className="rounded-lg border border-emerald-600 bg-white px-8 py-3 text-base font-semibold text-emerald-600 hover:bg-emerald-50">
                Try Reconciliation Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 