'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  location: string;
  savings?: string;
  timeframe?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
}

function StarRating({ rating, animated = false }: { rating: number; animated?: boolean }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          initial={animated ? { scale: 0, rotate: -180 } : undefined}
          animate={animated ? { scale: 1, rotate: 0 } : undefined}
          transition={animated ? { 
            delay: star * 0.1, 
            type: "spring" as const, 
            stiffness: 200 
          } : undefined}
        >
          <StarIcon
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function TestimonialCarousel({ 
  testimonials, 
  autoRotate = true, 
  rotateInterval = 5000,
  className = '' 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [dragDirection, setDragDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Auto-rotation logic
  useEffect(() => {
    if (!isAutoRotating) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, rotateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRotating, rotateInterval, testimonials.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    pauseAutoRotation();
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    pauseAutoRotation();
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoRotation();
  };

  const pauseAutoRotation = () => {
    setIsAutoRotating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Resume after 10 seconds
    setTimeout(() => {
      setIsAutoRotating(true);
    }, 10000);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      goToPrev();
    } else if (info.offset.x < -threshold) {
      goToNext();
    }
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={`relative ${className}`}>
      <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            What Canadian Contractors Say
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Real stories from contractors who've transformed their invoicing process
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: dragDirection * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dragDirection * -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              <div className="bg-white rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden shadow-sm border border-gray-200">
                {/* Quote Icon */}
                <div className="absolute top-4 left-4 text-6xl text-blue-500/20 font-serif">
                  "
                </div>
                
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="relative w-20 h-20 mx-auto mb-6"
                >
                  <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
                  <div className="relative w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600 overflow-hidden">
                    {currentTestimonial.avatar ? (
                      <Image
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      currentTestimonial.name.charAt(0)
                    )}
                  </div>
                </motion.div>

                {/* Star Rating */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center mb-6"
                >
                  <StarRating rating={currentTestimonial.rating} animated />
                </motion.div>

                {/* Content */}
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl lg:text-2xl text-slate-700 mb-8 italic leading-relaxed"
                >
                  "{currentTestimonial.content}"
                </motion.blockquote>

                {/* Author Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="border-t border-gray-200 pt-6"
                >
                  <div className="font-bold text-lg text-slate-800">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-blue-600 font-semibold">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">
                    📍 {currentTestimonial.location}
                  </div>
                  
                  {/* Savings Badge */}
                  {currentTestimonial.savings && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="inline-flex items-center mt-3 bg-gray-100 text-slate-800 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      💰 {currentTestimonial.savings} saved in {currentTestimonial.timeframe}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors group border border-gray-200"
          >
            <ChevronLeftIcon className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors group border border-gray-200"
          >
            <ChevronRightIcon className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 hover:bg-blue-400'
              }`}
            />
          ))}
        </div>

        {/* Thumbnail Strip */}
        <div className="flex justify-center space-x-4 mt-8 overflow-x-auto pb-2">
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={testimonial.id}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm font-bold text-slate-600">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                ) : (
                  testimonial.name.charAt(0)
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Default testimonials for InvoicePatch
export const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Mike Rodriguez',
    company: 'Rodriguez Electrical',
    role: 'Owner',
    content: 'Cut my invoice processing time from 3 hours to 15 minutes. The GPS tracking alone saved me from missing $2,400 in mileage claims this month.',
    rating: 5,
    avatar: '',
    location: 'Toronto, ON',
    savings: '$4,200',
    timeframe: '2 months'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    company: 'Northern Construction',
    role: 'Project Manager',
    content: 'Managing 15 contractors was a nightmare. Now I approve invoices in bulk and our payment delays dropped by 87%. Game changer.',
    rating: 5,
    avatar: '',
    location: 'Vancouver, BC',
    savings: '$8,500',
    timeframe: '3 months'
  },
  {
    id: '3',
    name: 'David Thompson',
    company: 'Atlantic Roofing',
    role: 'Contractor',
    content: 'The CRA compliance features saved me during my audit. Everything was perfectly organized and legitimate. Worth every penny.',
    rating: 5,
    avatar: '',
    location: 'Halifax, NS',
    savings: '$1,800',
    timeframe: '1 month'
  },
  {
    id: '4',
    name: 'Lisa Patel',
    company: 'Prairie Plumbing',
    role: 'Operations Director',
    content: 'Our cash flow improved dramatically. Contractors get paid faster, we save 12 hours weekly, and client satisfaction is through the roof.',
    rating: 5,
    avatar: '',
    location: 'Calgary, AB',
    savings: '$6,300',
    timeframe: '6 weeks'
  }
]; 