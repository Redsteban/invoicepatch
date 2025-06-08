import { supabaseAdmin } from './supabase'
import { SecurityUtils, SECURITY_CONFIG } from './security'

export interface SessionResult {
  success: boolean
  sessionToken?: string
  userId?: string
  expiresAt?: Date
  message?: string
}

export interface ValidateSessionResult {
  valid: boolean
  userId?: string
  sessionData?: any
  message?: string
}

export class SessionManager {
  static async createSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<SessionResult> {
    try {
      // Generate session token
      const sessionToken = SecurityUtils.generateSessionToken()
      const expiresAt = SecurityUtils.getSessionExpiry()

      // Clean up old sessions for this user (optional - keep only latest)
      await supabaseAdmin
        .from('security_sessions')
        .update({ is_active: false })
        .eq('user_id', userId)

      // Create new session
      const { data: session, error } = await supabaseAdmin
        .from('security_sessions')
        .insert({
          user_id: userId,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
          is_active: true
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update user's last login
      await supabaseAdmin
        .from('profiles')
        .update({
          last_login: new Date().toISOString(),
          login_attempts: 0,
          locked_until: null
        })
        .eq('id', userId)

      return {
        success: true,
        sessionToken,
        userId,
        expiresAt,
        message: 'Session created successfully'
      }

    } catch (error) {
      console.error('Create session error:', error)
      return {
        success: false,
        message: 'Failed to create session'
      }
    }
  }

  static async validateSession(sessionToken: string): Promise<ValidateSessionResult> {
    try {
      if (!sessionToken) {
        return {
          valid: false,
          message: 'No session token provided'
        }
      }

      // Find active session
      const { data: session, error } = await supabaseAdmin
        .from('security_sessions')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            email,
            full_name,
            role
          )
        `)
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .single()

      if (error || !session) {
        return {
          valid: false,
          message: 'Invalid session token'
        }
      }

      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        // Deactivate expired session
        await supabaseAdmin
          .from('security_sessions')
          .update({ is_active: false })
          .eq('id', session.id)

        return {
          valid: false,
          message: 'Session has expired'
        }
      }

      return {
        valid: true,
        userId: session.user_id,
        sessionData: {
          sessionId: session.id,
          userId: session.user_id,
          user: session.profiles,
          createdAt: session.created_at,
          expiresAt: session.expires_at,
          ipAddress: session.ip_address
        },
        message: 'Session is valid'
      }

    } catch (error) {
      console.error('Validate session error:', error)
      return {
        valid: false,
        message: 'Session validation failed'
      }
    }
  }

  static async refreshSession(sessionToken: string): Promise<SessionResult> {
    try {
      const validation = await this.validateSession(sessionToken)
      
      if (!validation.valid || !validation.userId) {
        return {
          success: false,
          message: 'Cannot refresh invalid session'
        }
      }

      // Extend session expiry
      const newExpiresAt = SecurityUtils.getSessionExpiry()

      await supabaseAdmin
        .from('security_sessions')
        .update({
          expires_at: newExpiresAt.toISOString()
        })
        .eq('session_token', sessionToken)

      return {
        success: true,
        sessionToken,
        userId: validation.userId,
        expiresAt: newExpiresAt,
        message: 'Session refreshed successfully'
      }

    } catch (error) {
      console.error('Refresh session error:', error)
      return {
        success: false,
        message: 'Failed to refresh session'
      }
    }
  }

  static async destroySession(sessionToken: string): Promise<{ success: boolean; message: string }> {
    try {
      await supabaseAdmin
        .from('security_sessions')
        .update({ is_active: false })
        .eq('session_token', sessionToken)

      return {
        success: true,
        message: 'Session destroyed successfully'
      }

    } catch (error) {
      console.error('Destroy session error:', error)
      return {
        success: false,
        message: 'Failed to destroy session'
      }
    }
  }

  static async destroyAllUserSessions(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      await supabaseAdmin
        .from('security_sessions')
        .update({ is_active: false })
        .eq('user_id', userId)

      return {
        success: true,
        message: 'All user sessions destroyed'
      }

    } catch (error) {
      console.error('Destroy all sessions error:', error)
      return {
        success: false,
        message: 'Failed to destroy sessions'
      }
    }
  }

  static async cleanupExpiredSessions(): Promise<void> {
    try {
      await supabaseAdmin
        .from('security_sessions')
        .update({ is_active: false })
        .lt('expires_at', new Date().toISOString())
    } catch (error) {
      console.error('Cleanup sessions error:', error)
    }
  }

  static async getUserSessions(userId: string): Promise<any[]> {
    try {
      const { data: sessions, error } = await supabaseAdmin
        .from('security_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return sessions || []

    } catch (error) {
      console.error('Get user sessions error:', error)
      return []
    }
  }
}

export default SessionManager 