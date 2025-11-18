// Supabase Edge Function: rate-limit-check
// This function checks and records authentication attempt rate limits
// Deploy this to: supabase/functions/rate-limit-check/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,           // Maximum failed attempts before lockout
  windowMinutes: 60,        // Time window for tracking attempts (1 hour)
  lockoutMinutes: 15,       // Lockout duration (15 minutes)
}

// Helper function to get client IP address
function getClientIP(req: Request): string {
  // Try various headers that might contain the real IP
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = req.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Fallback to a default (shouldn't happen in production)
  return 'unknown'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { email, attemptType = 'login', recordAttempt = false, success = false } = await req.json()

    // Get client IP address
    const ipAddress = getClientIP(req)

    // Check rate limit status
    const { data: rateLimitStatus, error: checkError } = await supabase.rpc('is_rate_limited', {
      p_email: email || null,
      p_ip_address: ipAddress,
      p_attempt_type: attemptType,
      p_max_attempts: RATE_LIMIT_CONFIG.maxAttempts,
      p_window_minutes: RATE_LIMIT_CONFIG.windowMinutes,
      p_lockout_minutes: RATE_LIMIT_CONFIG.lockoutMinutes,
    })

    if (checkError) {
      console.error('Error checking rate limit:', checkError)
      // On error, allow the request (fail open) but log the error
      return new Response(
        JSON.stringify({ 
          allowed: true, 
          error: 'Rate limit check failed',
          message: 'Unable to check rate limit. Request allowed for now.' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const isLocked = rateLimitStatus?.is_locked || false
    const remainingTime = rateLimitStatus?.remaining_time || 0
    const remainingAttempts = rateLimitStatus?.remaining_attempts || RATE_LIMIT_CONFIG.maxAttempts

    // If locked out, return error
    if (isLocked) {
      return new Response(
        JSON.stringify({ 
          allowed: false,
          isLocked: true,
          lockoutUntil: rateLimitStatus?.lockout_until,
          remainingTime: remainingTime,
          message: `Too many failed attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`
        }),
        { 
          status: 429, // Too Many Requests
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If recording an attempt, insert it into the database
    if (recordAttempt) {
      const { error: insertError } = await supabase
        .from('rate_limit_attempts')
        .insert({
          email: email || null,
          ip_address: ipAddress,
          attempt_type: attemptType,
          success: success,
        })

      if (insertError) {
        console.error('Error recording rate limit attempt:', insertError)
        // Don't fail the request if recording fails
      }
    }

    // Return rate limit status
    return new Response(
      JSON.stringify({ 
        allowed: true,
        isLocked: false,
        remainingAttempts: remainingAttempts,
        recentAttempts: rateLimitStatus?.recent_attempts || 0,
        failedAttempts: rateLimitStatus?.failed_attempts || 0,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Rate limit check error:', error)
    // On error, allow the request (fail open) but log the error
    return new Response(
      JSON.stringify({ 
        allowed: true,
        error: error.message,
        message: 'Rate limit check failed. Request allowed for now.' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

