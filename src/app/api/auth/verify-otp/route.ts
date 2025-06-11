import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()
    
    console.log('🔐 OTP verification attempt:', { email, otp })
    
    // Mock OTP validation
    // For testing, accept any 6-digit OTP or the test OTP "123456"
    const isValidOtp = /^\d{6}$/.test(otp) || otp === '123456'
    
    if (isValidOtp) {
      // Generate a mock session token
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      console.log('✅ OTP verified, session created:', sessionToken)
      
      return NextResponse.json({
        success: true,
        sessionToken,
        message: 'OTP verified successfully',
        user: {
          id: 'test-user-id',
          email: email,
          name: 'Test User'
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid OTP'
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ OTP verification failed:', error)
    return NextResponse.json({
      success: false,
      message: 'OTP verification failed'
    }, { status: 500 })
  }
} 