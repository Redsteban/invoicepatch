import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json()
    
    console.log('🔐 Validating session token:', sessionToken ? 'present' : 'missing')
    
    if (!sessionToken) {
      return NextResponse.json({
        valid: false,
        message: 'No session token provided'
      }, { status: 400 })
    }
    
    // Simple session validation for development
    // In production, this would check against database
    if (sessionToken.startsWith('session_')) {
      // Extract basic info from session token for development
      const parts = sessionToken.split('_')
      const timestamp = parts[1]
      const created = new Date(parseInt(timestamp))
      const now = new Date()
      const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
      
      // Session expires after 24 hours
      if (hoursDiff > 24) {
        return NextResponse.json({
          valid: false,
          message: 'Session has expired'
        }, { status: 401 })
      }
      
      return NextResponse.json({
        valid: true,
        user: {
          id: 'dev_user',
          username: 'demo_user',
          email: 'demo@example.com'
        },
        sessionData: {
          sessionToken,
          createdAt: created.toISOString()
        },
        message: 'Session is valid'
      })
    }
    
    return NextResponse.json({
      valid: false,
      message: 'Invalid session token format'
    }, { status: 401 })
    
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json({
      valid: false,
      message: 'Session validation failed'
    }, { status: 500 })
  }
} 