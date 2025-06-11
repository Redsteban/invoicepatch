import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    console.log('📧 OTP request for:', email)
    
    // Mock OTP generation and storage
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // In a real implementation, you would:
    // 1. Generate a secure OTP
    // 2. Store it in database with expiry
    // 3. Send email with OTP
    
    // For testing, we'll just log the OTP
    console.log('🔑 Generated OTP for', email, ':', otp)
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json({
      success: true,
      message: `OTP sent to ${email}`,
      // For testing purposes, include the OTP in response
      testOtp: otp
    })
    
  } catch (error) {
    console.error('❌ OTP request failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to send OTP'
    }, { status: 500 })
  }
} 