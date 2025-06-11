import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import OTPService from '@/lib/otpService'
import SecurityUtils from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    console.log('🔐 Forgot password request:', email)
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 })
    }
    
    // Check if user exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email)
      .single()
    
    if (profileError || !profile) {
      return NextResponse.json({
        success: false,
        message: 'No account found with this email address'
      }, { status: 404 })
    }
    
    // Send password reset OTP
    const ipAddress = SecurityUtils.getClientIP(request)
    const userAgent = SecurityUtils.getUserAgent(request)
    
    const otpResult = await OTPService.generateAndSendOTP(
      email,
      'password-reset',
      ipAddress,
      userAgent
    )
    
    if (!otpResult.success) {
      return NextResponse.json({
        success: false,
        message: otpResult.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Password reset code sent to your email'
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to process password reset request'
    }, { status: 500 })
  }
}
