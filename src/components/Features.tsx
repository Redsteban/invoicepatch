import {
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  EyeIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Zero Manual Data Entry',
    description: 'Project codes, rates, locations, and deadlines flow automatically from your system to contractor apps. No typing, no guessing, no errors.',
    icon: ArrowPathIcon,
    benefit: 'Eliminates 95% of data entry errors'
  },
  {
    name: 'Pre-Validated Invoices',
    description: 'Contractors submit invoices that are already filled with your exact data. You just verify hours and approve - no line-by-line checking.',
    icon: DocumentCheckIcon,
    benefit: 'Reduces approval time by 90%'
  },
  {
    name: 'Real-Time Work Tracking',
    description: 'See hours logged and costs accumulating as work happens. No more month-end surprises when invoices arrive.',
    icon: EyeIcon,
    benefit: 'Live project cost visibility'
  },
  {
    name: 'Instant Approval Workflow',
    description: 'Since invoice data came from your system, approve with confidence in seconds. Bulk approve multiple invoices at once.',
    icon: CheckCircleIcon,
    benefit: 'From hours to minutes weekly'
  },
  {
    name: 'Automated Deadline Management',
    description: 'Contractors get automatic reminders for invoice deadlines. No more chasing late submissions or delayed payments.',
    icon: ClockIcon,
    benefit: '100% on-time submissions'
  },
  {
    name: 'Built-in Budget Controls',
    description: 'Get alerts when project costs approach budgets. Prevent overruns before they happen instead of discovering them later.',
    icon: ChartBarIcon,
    benefit: 'Proactive budget management'
  }
];

const timeComparison = [
  {
    task: 'Invoice Reconciliation',
    before: '8 hours weekly',
    after: '45 minutes weekly',
    savings: '7.25 hours'
  },
  {
    task: 'Data Entry Corrections',
    before: '3 hours weekly', 
    after: '10 minutes weekly',
    savings: '2.8 hours'
  },
  {
    task: 'Project Code Verification',
    before: '2 hours weekly',
    after: '0 hours (automatic)',
    savings: '2 hours'
  },
  {
    task: 'Rate Card Updates',
    before: '1 hour monthly',
    after: '0 hours (sync)',
    savings: '1 hour'
  }
];

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Features Section */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Reconciliation Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built to Eliminate Manual Reconciliation
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Every feature designed around one goal: perfect invoice data that requires zero manual checking.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col bg-gray-50 rounded-xl p-6 border border-gray-200">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                    <feature.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <div className="mt-6">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 border border-emerald-200">
                      ✓ {feature.benefit}
                    </span>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Time Savings Breakdown */}
        <div className="mt-24 sm:mt-32">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Exactly How You'll Save Time
            </h3>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Real numbers from managers who eliminated invoice reconciliation
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-700">
                <div>Current Task</div>
                <div className="text-center">Before InvoicePatch</div>
                <div className="text-center">After InvoicePatch</div>
                <div className="text-center">Time Saved</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {timeComparison.map((item, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="font-medium text-gray-900">{item.task}</div>
                    <div className="text-center text-gray-600 font-medium">{item.before}</div>
                    <div className="text-center text-emerald-600 font-medium">{item.after}</div>
                    <div className="text-center">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                        {item.savings} saved
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-emerald-50 px-6 py-4 border-t border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Weekly Savings:</span>
                <span className="text-2xl font-bold text-emerald-600">13+ hours per week</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Average manager saves $2,600+ monthly in time costs (at $50/hour)
              </p>
            </div>
          </div>
        </div>

        {/* Integration Benefits */}
        <div className="mt-24 sm:mt-32">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h3 className="text-base font-semibold leading-7 text-emerald-600">System Integration</h3>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Works With Your Existing Workflow
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              No platform migration required. InvoicePatch syncs with what you already use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-4">
                <div className="bg-emerald-600 text-white px-4 py-2 rounded font-bold text-lg mx-auto inline-block">
                  QB
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">QuickBooks</h4>
              <p className="text-sm text-gray-600">Online & Desktop editions with full project tracking sync</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-4">
                <div className="bg-gray-800 text-white px-4 py-2 rounded font-bold text-lg mx-auto inline-block">
                  Sage
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sage 50</h4>
              <p className="text-sm text-gray-600">Canadian edition with job costing and vendor management</p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-4">
                <div className="bg-emerald-600 text-white px-4 py-2 rounded font-bold text-lg mx-auto inline-block">
                  Xero
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Xero</h4>
              <p className="text-sm text-gray-600">Project tracking with automated bank reconciliation</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-4">
                <div className="bg-gray-600 text-white px-4 py-2 rounded font-bold text-lg mx-auto inline-block">
                  Excel
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Excel/CSV</h4>
              <p className="text-sm text-gray-600">Smart template recognition for existing spreadsheet workflows</p>
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mt-24 sm:mt-32">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-gray-50 border border-emerald-200 px-6 py-16 sm:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Calculate Your Time Savings
              </h3>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                See exactly how much time and money you'll save by eliminating manual reconciliation
              </p>
              
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">13+ hrs</div>
                  <div className="text-gray-600">Weekly time savings</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">$2,600+</div>
                  <div className="text-gray-600">Monthly cost savings</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="text-3xl font-bold text-gray-700 mb-2">3 days</div>
                  <div className="text-gray-600">Setup time</div>
                </div>
              </div>

              <div className="mt-10">
                <button className="rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 mr-4">
                  See Reconciliation Demo
                </button>
                <button className="rounded-lg border border-emerald-600 bg-white px-8 py-3 text-base font-semibold text-emerald-600 hover:bg-emerald-50">
                  Calculate My ROI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 