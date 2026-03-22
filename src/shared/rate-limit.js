/**
 * Rate Limiting Module
 * Client-side + server-side rate limiting for login/signup attempts
 */
import { supabase } from './supabase.js'

const CONFIG = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000,  // 15 minutes
  windowDuration: 60 * 60 * 1000    // 1 hour
}

const STORAGE_KEY = 'academiq_rate_limit'

// ── Client-Side Rate Limiting ──

function getData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : { attempts: [], lockoutUntil: null }
  } catch {
    return { attempts: [], lockoutUntil: null }
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Silently fail if localStorage unavailable
  }
}

/**
 * Check if the account is currently locked out
 * @returns {{ locked: boolean, remainingTime: number }}
 */
export function isLockedOut() {
  const data = getData()
  if (data.lockoutUntil) {
    const now = Date.now()
    if (now < data.lockoutUntil) {
      return { locked: true, remainingTime: data.lockoutUntil - now }
    }
    // Lockout expired
    data.lockoutUntil = null
    saveData(data)
  }
  return { locked: false, remainingTime: 0 }
}

/**
 * Record a failed login attempt
 * @param {string} email
 */
export function recordFailedAttempt(email) {
  const data = getData()
  const now = Date.now()

  // Clean old attempts
  data.attempts = data.attempts.filter(
    a => (now - a.timestamp) < CONFIG.windowDuration
  )

  // Add new attempt
  data.attempts.push({ email: email.toLowerCase(), timestamp: now })

  // Check if locked out
  const recentForEmail = data.attempts.filter(
    a => a.email === email.toLowerCase()
  )
  if (recentForEmail.length >= CONFIG.maxAttempts) {
    data.lockoutUntil = now + CONFIG.lockoutDuration
  }

  saveData(data)
}

/**
 * Clear rate limit data for an email (on successful login)
 * @param {string} email
 */
export function clearRateLimit(email) {
  const data = getData()
  data.attempts = data.attempts.filter(
    a => a.email !== email.toLowerCase()
  )
  data.lockoutUntil = null
  saveData(data)
}

/**
 * Format remaining lockout time as mm:ss
 * @param {number} ms
 * @returns {string}
 */
export function formatRemainingTime(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// ── Server-Side Rate Limiting ──

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Check server-side rate limit
 * @param {string} email
 * @param {string} attemptType - 'login' or 'signup'
 * @returns {Promise<{ allowed: boolean, isLocked: boolean, remainingTime: number }>}
 */
export async function checkServerRateLimit(email, attemptType = 'login') {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/rate-limit-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ email, attemptType, recordAttempt: false })
    })
    if (!response.ok) return { allowed: true, isLocked: false }
    return await response.json()
  } catch {
    return { allowed: true, isLocked: false }
  }
}

/**
 * Record an attempt on the server
 * @param {string} email
 * @param {string} attemptType
 * @param {boolean} success
 */
export async function recordServerAttempt(email, attemptType = 'login', success = false) {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/rate-limit-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ email, attemptType, recordAttempt: true, success })
    })
  } catch {
    // Silently fail
  }
}
