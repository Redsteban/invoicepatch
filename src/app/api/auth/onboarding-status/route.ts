import { NextRequest, NextResponse } from 'next/server'
import { checkOnboardingStatus } from '@/lib/onboarding-utils'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the user ID from the authenticated session
    // For now, we'll accept it as a query parameter for testing
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const hasCompletedOnboarding = await checkOnboardingStatus(userId)
    
    return NextResponse.json({
      success: true,
      hasCompletedOnboarding,
      needsOnboarding: !hasCompletedOnboarding
    })
    
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check onboarding status' },
      { status: 500 }
    )
  }
} 