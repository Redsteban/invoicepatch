import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()
    
    console.log('📝 Signup attempt:', { username, email, password: '***' })
    
    if (!username || !email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 })
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 });
    }
    
    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 8 characters'
      }, { status: 400 });
    }
    
    if (username.length < 3) {
      return NextResponse.json({
        success: false,
        message: 'Username must be at least 3 characters'
      }, { status: 400 });
    }
    
    // Simulate user creation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ User created successfully:', { username, email })
    
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      email: email,
      user: {
        id: `user_${Date.now()}`,
        username,
        email,
        fullName: username
      }
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
    
  } catch (error) {
    console.error('❌ Signup failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Account creation failed'
    }, { status: 500 })
  }
} 