import { supabaseAdmin } from '@/lib/supabase'

/**
 * Check if a user has completed onboarding by looking for existing invoices
 */
export const checkOnboardingStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('trial_invoices')
      .select('id')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected for new users
      console.error('Error checking onboarding status:', error)
      return false
    }
    
    return !!data
  } catch (error) {
    console.error('Error in checkOnboardingStatus:', error)
    return false
  }
}

/**
 * Get user's onboarding data if it exists
 */
export const getUserOnboardingData = async (userId: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('trial_invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error getting onboarding data:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getUserOnboardingData:', error)
    return null
  }
}

/**
 * Check if user needs to be redirected to onboarding
 * This can be used in client-side components with proper auth context
 */
export const shouldRedirectToOnboarding = async (userId: string | null): Promise<boolean> => {
  if (!userId) return false
  
  const hasCompletedOnboarding = await checkOnboardingStatus(userId)
  return !hasCompletedOnboarding
} 