import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    console.log('🔐 Login attempt:', { username, password: '***' })
    
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required'
      }, { status: 400 })
    }
    
    // Temporary solution - known users for development
    const devUsers = [
      { username: 'redsteban', password: 'AaBb123456^', email: 'redsteban@hotmail.com', id: 'dev_1' },
      { username: 'testuser', password: 'TestPass123!', email: 'test@example.com', id: 'dev_2' },
      { username: 'testuser2', password: 'TestPass123!', email: 'test2@example.com', id: 'dev_3' }
    ];
    
    // Find user in development list
    const user = devUsers.find(u => u.username === username);
    
    if (!user) {
      console.log('❌ User not found:', username)
      return NextResponse.json({
        success: false,
        message: 'Invalid username or password'
      }, { status: 401 })
    }
    
    // Simple password check for development
    if (user.password !== password) {
      console.log('❌ Invalid password for user:', username)
      return NextResponse.json({
        success: false,
        message: 'Invalid username or password'
      }, { status: 401 })
    }
    
    console.log('✅ Login successful for user:', username)
    
    return NextResponse.json({
      success: true,
      email: user.email,
      username: user.username,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.username
      },
      message: 'Login successful'
    })
    
  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json({
      success: false,
      message: 'Login failed'
    }, { status: 500 })
  }
} 