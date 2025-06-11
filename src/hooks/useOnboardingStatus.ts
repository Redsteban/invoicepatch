import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface OnboardingStatus {
  hasCompletedOnboarding: boolean
  needsOnboarding: boolean
  isLoading: boolean
  error: string | null
}

export const useOnboardingStatus = (userId: string | null, shouldRedirect: boolean = true) => {
  const [status, setStatus] = useState<OnboardingStatus>({
    hasCompletedOnboarding: false,
    needsOnboarding: false,
    isLoading: true,
    error: null
  })
  
  const router = useRouter()

  useEffect(() => {
    const checkStatus = async () => {
      if (!userId) {
        setStatus(prev => ({ ...prev, isLoading: false }))
        return
      }

      try {
        const response = await fetch(`/api/auth/onboarding-status?userId=${userId}`)
        const data = await response.json()

        if (data.success) {
          setStatus({
            hasCompletedOnboarding: data.hasCompletedOnboarding,
            needsOnboarding: data.needsOnboarding,
            isLoading: false,
            error: null
          })

          // Redirect to onboarding if needed
          if (shouldRedirect && data.needsOnboarding) {
            router.push('/onboarding')
          }
        } else {
          setStatus(prev => ({
            ...prev,
            isLoading: false,
            error: data.error || 'Failed to check onboarding status'
          }))
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: 'Network error while checking onboarding status'
        }))
      }
    }

    checkStatus()
  }, [userId, shouldRedirect, router])

  return status
} 