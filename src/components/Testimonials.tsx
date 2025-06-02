import { StarIcon } from '@heroicons/react/20/solid';

const testimonials = [
  {
    body: "Friday afternoons used to be my nightmare - 8 hours of matching contractor invoices to our QuickBooks data. Now I approve everything in under an hour because the data perfectly matches our system. My weekends are back.",
    author: {
      name: 'Sarah Chen',
      handle: 'Operations Manager',
      company: 'Toronto General Construction',
      location: 'Ontario'
    },
    stats: {
      timeSaved: '7+ hours weekly',
      errorReduction: '95% fewer errors',
      system: 'QuickBooks Online'
    }
  },
  {
    body: "The billing errors were killing us. Contractors would submit invoices with wrong project codes, missing charges, incorrect rates. We'd catch maybe 60% in review. Now the data comes straight from our Sage system - it's impossible to be wrong.",
    author: {
      name: 'Mike Rodriguez',
      handle: 'Finance Director', 
      company: 'Prairie Wind Construction',
      location: 'Alberta'
    },
    stats: {
      timeSaved: '12 hours weekly',
      errorReduction: '100% data accuracy',
      system: 'Sage 50 Canadian'
    }
  },
  {
    body: "I used to dread contractor invoices. Project ABC-123 becomes 'Johnson Kitchen' becomes 'Residential Job #3' - different names everywhere. InvoicePatch syncs our exact project codes. Zero confusion, zero reconciliation time.",
    author: {
      name: 'Jennifer Walsh',
      handle: 'Project Controller',
      company: 'Atlantic Building Solutions',
      location: 'Nova Scotia'  
    },
    stats: {
      timeSaved: '6 hours weekly',
      errorReduction: '90% fewer corrections',
      system: 'Xero + Excel'
    }
  },
  {
    body: "We were losing 15-20% revenue to undercharging because contractors didn't know our current rates. The back-and-forth to fix invoices was endless. Now they see approved rates in real-time and bill correctly the first time.",
    author: {
      name: 'David Kim', 
      handle: 'Operations Manager',
      company: 'West Coast Renovations',
      location: 'British Columbia'
    },
    stats: {
      timeSaved: '10 hours weekly',
      errorReduction: '20% revenue recovery',
      system: 'QuickBooks Desktop'
    }
  },
  {
    body: "Month-end reconciliation was a 3-day ordeal. Spreadsheets everywhere, phone calls to contractors, manual corrections. InvoicePatch eliminated all of that - our books close in hours instead of days.",
    author: {
      name: 'Lisa Thompson',
      handle: 'Finance Manager',
      company: 'Central Plains Construction',
      location: 'Manitoba'
    },
    stats: {
      timeSaved: '20+ hours monthly',
      errorReduction: '0 reconciliation needed',
      system: 'Custom ERP + Excel'
    }
  },
  {
    body: "The tax nightmare was real - different provinces, different rates, contractors confused about HST vs PST+GST. InvoicePatch calculates everything automatically based on project location. Tax season went from chaos to smooth.",
    author: {
      name: 'Robert Wilson',
      handle: 'Accounting Director',
      company: 'Northern Canada Builders',
      location: 'Multiple Provinces'
    },
    stats: {
      timeSaved: '40+ hours during tax season',
      errorReduction: 'Automated tax compliance',
      system: 'Multiple accounting systems'
    }
  }
];

export default function Testimonials() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-emerald-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            "We Got Our Weekends Back"
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Real stories from managers who eliminated invoice reconciliation hell
          </p>
        </div>
        
        {/* Improved grid layout */}
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col rounded-2xl bg-gray-50 border border-gray-200 p-6 hover:shadow-lg hover:bg-white transition-all duration-300 h-full">
              {/* Rating */}
              <div className="flex gap-x-1 text-emerald-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              
              {/* Testimonial - flex-grow to push author to bottom */}
              <blockquote className="text-gray-900 mb-4 flex-grow">
                <p className="text-sm leading-relaxed">"{testimonial.body}"</p>
              </blockquote>
              
              {/* Stats - compact layout */}
              <div className="mb-4 space-y-2 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Time Saved:</span>
                  <span className="text-xs font-bold text-emerald-700">{testimonial.stats.timeSaved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Improvement:</span>
                  <span className="text-xs font-bold text-emerald-700">{testimonial.stats.errorReduction}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">System:</span>
                  <span className="text-xs font-semibold text-gray-800">{testimonial.stats.system}</span>
                </div>
              </div>
              
              {/* Author - stays at bottom */}
              <figcaption className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold text-xs">
                      {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{testimonial.author.name}</div>
                    <div className="text-gray-600 text-xs truncate">{testimonial.author.handle}</div>
                    <div className="text-gray-500 text-xs truncate">{testimonial.author.company}</div>
                    <div className="text-gray-400 text-xs">{testimonial.author.location}</div>
                  </div>
                </div>
              </figcaption>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-6 py-12 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join 500+ Managers Who Eliminated Reconciliation Hell
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Average time savings: 13 hours per week. Average cost savings: $2,600+ monthly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-500">
                See Your Reconciliation Demo
              </button>
              <button className="rounded-lg border border-emerald-600 bg-white px-8 py-3 text-base font-semibold text-emerald-600 hover:bg-emerald-50">
                Schedule 15-min Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 