/**
 * Authentication Module
 * Handles login, logout, session management, and auth state changes
 */
import { supabase } from './supabase.js'

/**
 * Get the current authenticated user
 * @returns {Promise<object|null>} User object or null
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    // No stored session is the normal signed-out state, not an error worth logging
    if (error.name !== 'AuthSessionMissingError') console.error('Error getting current user:', error)
    return null
  }
  return user
}

/**
 * Sign in with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { user: data?.user ?? null, error }
}

/**
 * Sign in with Google OAuth
 * @returns {Promise<{error: object|null}>}
 */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
  return { error }
}

/**
 * Sign up with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  return { user: data?.user ?? null, error }
}

/**
 * Send password reset email
 * @param {string} email
 * @returns {Promise<{error: object|null}>}
 */
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/index.html#reset`
  })
  return { error }
}

/**
 * Update password (after reset link clicked)
 * @param {string} newPassword
 * @returns {Promise<{error: object|null}>}
 */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error }
}

/**
 * Sign out the current user
 * @returns {Promise<{error: object|null}>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Listen for auth state changes
 * @param {function} callback - Called with (event, session)
 * @returns {function} Unsubscribe function
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return () => subscription.unsubscribe()
}

/**
 * Require authentication — redirects to login if not authenticated
 * Call this at the top of any protected page: `user = await requireAuth(); if (!user) return`
 * @returns {Promise<object|null>} The authenticated user, or null while redirecting to login
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    // replace(): the back button shouldn't return to a page that immediately redirects again
    window.location.replace('/index.html')
    return null
  }
  return user
}
