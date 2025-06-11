import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract session token
    const token = authHeader.replace('Bearer ', '');
    
    // Simple token validation for development
    if (!token.startsWith('session_')) {
      return NextResponse.json(
        { success: false, error: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Mock trials data for development
    const mockTrials = [
      {
        id: 'trial_1',
        status: 'active',
        created_at: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        contractor_email: 'demo@example.com',
        title: 'Construction Project Trial'
      },
      {
        id: 'trial_2',
        status: 'completed',
        created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        contractor_email: 'demo@example.com',
        title: 'Plumbing Services Trial'
      }
    ];

    // Categorize trials
    const now = new Date();
    const active = mockTrials.filter(trial => {
      const endDate = new Date(trial.end_date);
      return trial.status === 'active' && endDate >= now;
    });

    const completed = mockTrials.filter(trial => {
      const endDate = new Date(trial.end_date);
      return trial.status === 'completed' || endDate < now;
    });

    return NextResponse.json({
      success: true,
      trials: {
        active,
        completed,
        total: mockTrials.length
      }
    });

  } catch (error) {
    console.error('User trials API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 