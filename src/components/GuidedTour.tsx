'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  Lightbulb,
  Target,
  Zap,
  Star,
  HelpCircle,
  Eye,
  MousePointer,
  BookOpen,
  Gift,
  Sparkles
} from 'lucide-react'

export interface TourStep {
  id: string
  title: string
  content: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: 'click' | 'hover' | 'input' | 'wait'
  interactive?: boolean
  spotlight?: boolean
  arrow?: boolean
}

export interface TourConfig {
  id: string
  title: string
  description: string
  steps: TourStep[]
  category: 'onboarding' | 'feature' | 'demo' | 'help'
}

const GuidedTour: React.FC = () => {
  const [isActive, setIsActive] = useState(false)
  const [currentTour, setCurrentTour] = useState<TourConfig | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showTourSelector, setShowTourSelector] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const mockTours: TourConfig[] = [
    {
      id: 'welcome-onboarding',
      title: 'Welcome to InvoicePatch',
      description: 'Learn the basics of invoice management in just 3 minutes',
      category: 'onboarding',
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to InvoicePatch! 👋',
          content: 'We\'re excited to help you streamline your invoice management. This quick tour will show you the key features.',
          target: 'body',
          position: 'center',
          spotlight: true
        },
        {
          id: 'sidebar-navigation',
          title: 'Navigate with Ease',
          content: 'Use the sidebar to access all major features. Each section is designed for specific invoice management tasks.',
          target: '[data-tour="sidebar"]',
          position: 'right',
          arrow: true,
          spotlight: true
        }
      ]
    }
  ]

  const startTour = useCallback((tourId: string) => {
    const tour = mockTours.find(t => t.id === tourId)
    if (!tour) return

    setCurrentTour(tour)
    setCurrentStep(0)
    setIsActive(true)
    setShowTourSelector(false)
  }, [])

  const stopTour = useCallback(() => {
    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
  }, [])

  const nextStep = useCallback(() => {
    if (!currentTour) return

    if (currentStep < currentTour.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      stopTour()
    }
  }, [currentTour, currentStep, stopTour])

  return (
    <>
      {/* Tour Trigger Button */}
      {!isActive && (
        <div className="fixed bottom-4 right-4 z-50">
          <motion.button
            onClick={() => setShowTourSelector(true)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Start Interactive Tour"
          >
            <HelpCircle className="w-6 h-6" />
          </motion.button>
        </div>
      )}

      {/* Tour Selector Modal */}
      <AnimatePresence>
        {showTourSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTourSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <span>Choose Your Tour</span>
                </h2>
                <button
                  onClick={() => setShowTourSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => startTour(tour.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold text-gray-900">{tour.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tour.description}</p>
                    <span className="text-xs text-gray-500">{tour.steps.length} steps</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour Tooltip */}
      <AnimatePresence>
        {isActive && currentTour && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 max-w-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {currentTour.steps[currentStep]?.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {currentTour.steps[currentStep]?.content}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={stopTour}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Skip tour
                </button>
                <button
                  onClick={nextStep}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentStep === currentTour.steps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default GuidedTour 