'use client';

import AnimatedCounter, { defaultStats } from './AnimatedCounter';
import TestimonialCarousel, { defaultTestimonials } from './TestimonialCarousel';
import FeatureShowcase, { defaultFeatures } from './FeatureShowcase';
import UrgencyBanner from './UrgencyBanner';
import TrustSignals from './TrustSignals';
import DarkModeToggle from './DarkModeToggle';

export default function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-white">
      {/* Dark Mode Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      {/* Urgency Banner - Sticky at top */}
      <UrgencyBanner 
        spotsLeft={67}
        timeLeft={{ hours: 23, minutes: 14, seconds: 32 }}
        message="Price increases"
        onClose={() => console.log('Banner closed')}
      />

      {/* Main content with top padding to account for sticky banner */}
      <div className="pt-20 space-y-24 pb-24">
        
        {/* Hero Section with Counter */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-black text-slate-800 mb-6">
              InvoicePatch
              <span className="block text-blue-600">UI Components</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Modern, animated components designed to maximize conversions for Canadian contractors.
            </p>
          </div>
          
          <AnimatedCounter 
            stats={defaultStats}
            className="max-w-6xl mx-auto" 
          />
        </section>

        {/* Feature Showcase */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FeatureShowcase 
            features={defaultFeatures}
            className="max-w-7xl mx-auto" 
          />
        </section>

        {/* Testimonial Carousel */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialCarousel 
            testimonials={defaultTestimonials}
            autoRotate={true}
            rotateInterval={6000}
            className="max-w-6xl mx-auto" 
          />
        </section>

        {/* Trust Signals */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TrustSignals className="max-w-6xl mx-auto" />
        </section>

        {/* Usage Instructions */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-8 lg:p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
              How to Use These Components
            </h2>
            
            <div className="space-y-6 text-slate-600">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  1. Animated Counter
                </h3>
                <p className="mb-2">
                  Displays key statistics with count-up animations and pulsing effects every 5 seconds.
                </p>
                <code className="bg-white px-3 py-1 rounded text-sm border border-gray-200">
                  {`<AnimatedCounter stats={yourStats} />`}
                </code>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  2. Testimonial Carousel
                </h3>
                <p className="mb-2">
                  Auto-rotating customer testimonials with swipe gestures and animated star ratings.
                </p>
                <code className="bg-white px-3 py-1 rounded text-sm border border-gray-200">
                  {`<TestimonialCarousel testimonials={yourTestimonials} autoRotate={true} />`}
                </code>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  3. Feature Showcase
                </h3>
                <p className="mb-2">
                  Interactive feature cards with expandable details and hover animations.
                </p>
                <code className="bg-white px-3 py-1 rounded text-sm border border-gray-200">
                  {`<FeatureShowcase features={yourFeatures} />`}
                </code>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  4. Trust Signals
                </h3>
                <p className="mb-2">
                  Security badges, testimonials, and money-back guarantee to build credibility.
                </p>
                <code className="bg-white px-3 py-1 rounded text-sm border border-gray-200">
                  {`<TrustSignals />`}
                </code>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  5. Urgency Banner
                </h3>
                <p className="mb-2">
                  Countdown timer and scarcity messaging to drive immediate action.
                </p>
                <code className="bg-white px-3 py-1 rounded text-sm border border-gray-200">
                  {`<UrgencyBanner spotsLeft={67} timeLeft={{hours: 23, minutes: 14, seconds: 32}} />`}
                </code>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                💡 Pro Tips
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• All components are fully responsive and touch-friendly</li>
                <li>• Components use modern CSS animations and are optimized for performance</li>
                <li>• Pass custom data through props to customize content</li>
                <li>• All animations respect user's reduced motion preferences</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 