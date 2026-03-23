/**
 * Login Page — Authentication (Sign In / Sign Up / Google OAuth)
 * Ported from v0.6.7 with modular architecture
 */
import { supabase } from '../shared/supabase.js'
import { getCurrentUser, onAuthStateChange, resetPassword, updatePassword } from '../shared/auth.js'
import { navigate } from '../shared/router.js'
import { isValidEmail, validatePassword, setPersistentLogin, getPersistentLogin, clearPersistentLogin } from '../shared/utils.js'
import { showToast } from '../shared/toast.js'
import { isLockedOut, recordFailedAttempt, clearRateLimit, formatRemainingTime, checkServerRateLimit, recordServerAttempt } from '../shared/rate-limit.js'

// ── State ──
let isSignUpMode = false
let lockoutIntervalId = null

// ── DOM Elements ──
const $ = (id) => document.getElementById(id)

// ── Initialization ──
async function init() {
  const loadingEl = $('loading')
  const loginEl = $('login')

  // Check for OAuth/reset callback tokens in URL hash
  const hash = window.location.hash.substring(1)
  if (hash) {
    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type = hashParams.get('type')

    // Clear hash immediately for security
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    if (accessToken) {
      try {
        const { data, error } = await Promise.race([
          supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ])

        // Password reset flow — show new password form instead of redirecting
        if (type === 'recovery' && !error && data?.user) {
          handlePasswordResetCallback()
          return
        }

        if (!error && data?.user) {
          navigate('dashboard')
          return
        }
      } catch {
        // Fall through to show login
      }
    }
  }

  // Check for saved login / existing session
  const { email: savedEmail, isLoggedIn } = getPersistentLogin()
  if (savedEmail && isLoggedIn === 'true') {
    try {
      const { data: { session } } = await Promise.race([
        supabase.auth.getSession(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
      ])
      if (session?.user?.email === savedEmail) {
        navigate('dashboard')
        return
      }
    } catch {
      // Fall through to show login
    }
  }

  // Check for any existing session
  try {
    const { data: { session } } = await Promise.race([
      supabase.auth.getSession(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ])
    if (session?.user) {
      navigate('dashboard')
      return
    }
  } catch {
    // Fall through to show login
  }

  // No session found — show landing page + login form
  if (loadingEl) loadingEl.classList.add('hidden')
  if (loginEl) loginEl.classList.remove('hidden')
  const landingEl = document.getElementById('landing')
  if (landingEl) landingEl.classList.remove('hidden')

  // Logo load/error handlers (moved from inline HTML for CSP compliance)
  const logoImg = document.getElementById('login-logo-img')
  if (logoImg) {
    const showLogo = () => { logoImg.style.display = 'block'; logoImg.nextElementSibling.style.display = 'none' }
    const hideLogo = () => { logoImg.style.display = 'none'; logoImg.nextElementSibling.style.display = 'block' }
    logoImg.addEventListener('load', showLogo)
    logoImg.addEventListener('error', hideLogo)
    // If image already loaded (cached), trigger immediately
    if (logoImg.complete && logoImg.naturalWidth > 0) showLogo()
  }

  // Pre-fill email if saved
  if (savedEmail) {
    const emailInput = $('email')
    if (emailInput) emailInput.value = savedEmail
  }

  // Check lockout status
  const lockout = isLockedOut()
  if (lockout.locked) showLockoutMessage()

  // Bind event listeners
  bindEvents()

}

// ── Event Binding ──
function bindEvents() {
  // Form submission
  $('login-form')?.addEventListener('submit', handleEmailLogin)

  // Google OAuth
  $('google-btn')?.addEventListener('click', handleGoogleLogin)

  // Toggle Sign Up / Sign In
  $('toggle-link')?.addEventListener('click', (e) => {
    e.preventDefault()
    toggleAuthMode()
  })

  // Forgot password
  $('forgot-link')?.addEventListener('click', handleForgotPassword)

  // Real-time password validation (bound dynamically in sign-up mode)
  $('password')?.addEventListener('input', () => {
    if (isSignUpMode) updatePasswordRequirements()
  })

  // Auth state listener — if they sign in from another tab
  onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      navigate('dashboard')
    }
  })
}

// ── Toggle Sign Up / Sign In Mode ──
function toggleAuthMode() {
  isSignUpMode = !isSignUpMode

  const loginBtn = $('login-btn')
  const toggleLink = $('toggle-link')
  const toggleText = $('toggle-text')
  const requirements = $('password-requirements')
  const passwordInput = $('password')

  if (isSignUpMode) {
    loginBtn.textContent = 'Sign Up'
    toggleText.textContent = 'Already have an account? '
    toggleLink.textContent = 'Sign In'
    requirements?.classList.remove('hidden')
    passwordInput?.setAttribute('autocomplete', 'new-password')
  } else {
    loginBtn.textContent = 'Sign In'
    toggleText.textContent = "Don't have an account? "
    toggleLink.textContent = 'Sign Up'
    requirements?.classList.add('hidden')
    passwordInput?.setAttribute('autocomplete', 'current-password')
  }
}

// ── Real-Time Password Requirements ──
function updatePasswordRequirements() {
  const password = $('password')?.value || ''

  const checks = {
    'req-length': password.length >= 8,
    'req-uppercase': /[A-Z]/.test(password),
    'req-lowercase': /[a-z]/.test(password),
    'req-number': /[0-9]/.test(password),
    'req-special': /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }

  for (const [id, met] of Object.entries(checks)) {
    const el = $(id)
    if (el) {
      el.className = met ? 'req-met' : 'req-unmet'
    }
  }
}

// ── Email Login/SignUp Handler ──
async function handleEmailLogin(event) {
  event.preventDefault()

  const email = $('email')?.value.trim()
  const password = $('password')?.value
  const loginBtn = $('login-btn')
  const messageEl = $('message')

  if (!email || !password) {
    showToast('Please enter both email and password.', 'error')
    return
  }

  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address.', 'error')
    return
  }

  // Rate limit check (sign-in only)
  if (!isSignUpMode) {
    const lockout = isLockedOut()
    if (lockout.locked) {
      showLockoutMessage()
      return
    }
    const serverLimit = await checkServerRateLimit(email, 'login')
    if (!serverLimit.allowed || serverLimit.isLocked) {
      const minutes = Math.ceil((serverLimit.remainingTime || 0) / 60)
      showToast(`Too many failed attempts. Try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`, 'error')
      return
    }
  }

  // Show loading state
  loginBtn.disabled = true
  const originalText = loginBtn.textContent
  loginBtn.innerHTML = '<div class="loading-spinner" style="width:20px;height:20px;margin:0 auto;"></div>'

  try {
    if (isSignUpMode) {
      await handleSignUp(email, password)
    } else {
      await handleSignIn(email, password)
    }
  } catch (error) {
    if (!isSignUpMode) {
      recordFailedAttempt(email)
      await recordServerAttempt(email, 'login', false)
    }
    const lockout = isLockedOut()
    if (lockout.locked) {
      showLockoutMessage()
    } else {
      showToast('Invalid email or password. Please try again.', 'error')
    }
  } finally {
    loginBtn.disabled = false
    loginBtn.textContent = originalText
  }
}

// ── Sign In ──
async function handleSignIn(email, password) {
  const messageEl = $('message')

  const { data, error } = await Promise.race([
    supabase.auth.signInWithPassword({ email, password }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
  ])

  if (error) {
    recordFailedAttempt(email)
    await recordServerAttempt(email, 'login', false)
    const lockout = isLockedOut()
    if (lockout.locked) {
      showLockoutMessage()
    } else {
      showToast('Invalid email or password. Please try again.', 'error')
    }
    return
  }

  // Success
  clearRateLimit(email)
  await recordServerAttempt(email, 'login', true)
  clearLockoutMsg()

  if ($('remember-me')?.checked) {
    setPersistentLogin(email, true)
  }

  showToast('Successfully signed in!', 'success')
  setTimeout(() => navigate('dashboard'), 800)
}

// ── Sign Up ──
async function handleSignUp(email, password) {
  const messageEl = $('message')

  // Validate password strength
  const validation = validatePassword(password)
  if (!validation.isValid) {
    showToast('Password does not meet requirements: ' + validation.errors.join(', '), 'error')
    return
  }

  // Server rate limit for signups
  const serverLimit = await checkServerRateLimit(email, 'signup')
  if (!serverLimit.allowed || serverLimit.isLocked) {
    const minutes = Math.ceil((serverLimit.remainingTime || 0) / 60)
    showToast(`Too many sign-up attempts. Try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`, 'error')
    return
  }

  const { data, error } = await Promise.race([
    supabase.auth.signUp({ email, password }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
  ])

  if (error) {
    await recordServerAttempt(email, 'signup', false)
    if (error.message?.toLowerCase().includes('password')) {
      showToast('Password does not meet security requirements.', 'error')
    } else {
      showToast('Unable to create account. Please try again.', 'error')
    }
    return
  }

  // Success
  clearRateLimit(email)
  await recordServerAttempt(email, 'signup', true)

  if ($('remember-me')?.checked) {
    setPersistentLogin(email, true)
  }

  showToast('Account created! Check your email for confirmation if required.', 'success')
  setTimeout(() => navigate('dashboard'), 1000)
}

// ── Google OAuth ──
async function handleGoogleLogin() {
  const messageEl = $('message')

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) {
      showToast('Google login failed. Please try again.', 'error')
    }
    // Redirect happens automatically
  } catch {
    showToast('Google login failed. Please try again.', 'error')
  }
}

// ── Forgot Password ──
async function handleForgotPassword(e) {
  e.preventDefault()
  const messageEl = $('message')
  const email = $('email')?.value.trim()

  if (!email) {
    showToast('Please enter your email address first, then click "Forgot your password?"', 'error')
    $('email')?.focus()
    return
  }

  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address.', 'error')
    return
  }

  const link = $('forgot-link')
  const originalText = link.textContent
  link.textContent = 'Sending...'
  link.style.pointerEvents = 'none'

  try {
    const { error } = await resetPassword(email)
    if (error) throw error
    showToast('Password reset email sent! Check your inbox for a link to reset your password.', 'success')
  } catch (err) {
    showToast('Failed to send reset email. Please try again.', 'error')
  } finally {
    link.textContent = originalText
    link.style.pointerEvents = ''
  }
}

// ── Handle Password Reset Callback ──
async function handlePasswordResetCallback() {
  const messageEl = $('message')
  const loadingEl = $('loading')
  const loginEl = $('login')

  // Show a new password form
  if (loadingEl) loadingEl.classList.add('hidden')
  if (loginEl) loginEl.classList.remove('hidden')

  const card = document.querySelector('.login-card')
  if (!card) return

  card.innerHTML = `
    <div class="login-logo">
      <img alt="AcademiQR" src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png"
           style="max-height: 80px; width: auto; margin: 0 auto; display: block;">
    </div>
    <h2 style="text-align:center; color:#1A2F5B; margin:16px 0 8px;">Set New Password</h2>
    <p style="text-align:center; color:#64748b; font-size:0.85rem; margin-bottom:20px;">Enter your new password below.</p>
    <div id="message"></div>
    <form id="reset-form">
      <div class="form-group">
        <label for="new-password">New Password</label>
        <input type="password" id="new-password" placeholder="Enter new password" required autocomplete="new-password">
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" placeholder="Confirm new password" required>
      </div>
      <button type="submit" class="btn btn-primary btn-full" id="reset-btn">Update Password</button>
    </form>
  `

  document.getElementById('reset-form')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const newPass = document.getElementById('new-password')?.value
    const confirmPass = document.getElementById('confirm-password')?.value
    const msg = document.getElementById('message')
    const btn = document.getElementById('reset-btn')

    if (!newPass || newPass.length < 8) {
      showToast('Password must be at least 8 characters.', 'error')
      return
    }
    if (newPass !== confirmPass) {
      showToast('Passwords do not match.', 'error')
      return
    }

    const validation = validatePassword(newPass)
    if (!validation.isValid) {
      showToast('Password does not meet requirements: ' + validation.errors.join(', '), 'error')
      return
    }

    btn.disabled = true
    btn.innerHTML = '<div class="loading-spinner" style="width:20px;height:20px;margin:0 auto;"></div>'

    try {
      const { error } = await updatePassword(newPass)
      if (error) throw error
      showToast('Password updated successfully! Redirecting...', 'success')
      setTimeout(() => navigate('dashboard'), 1500)
    } catch (err) {
      showToast('Failed to update password: ' + (err.message || 'Please try again.'), 'error')
      btn.disabled = false
      btn.textContent = 'Update Password'
    }
  })
}

// ── Lockout Messages ──
function showLockoutMessage() {
  const messageEl = $('message')
  if (!messageEl) return

  if (lockoutIntervalId) clearInterval(lockoutIntervalId)

  function update() {
    const lockout = isLockedOut()
    if (lockout.locked) {
      const time = formatRemainingTime(lockout.remainingTime)
      messageEl.innerHTML = `<div class="message message-error">
        <strong>Account Locked</strong><br>
        Too many failed attempts. Try again in <strong>${time}</strong>.
      </div>`
    } else {
      messageEl.innerHTML = ''
      if (lockoutIntervalId) {
        clearInterval(lockoutIntervalId)
        lockoutIntervalId = null
      }
    }
  }

  update()
  lockoutIntervalId = setInterval(update, 1000)
}

function clearLockoutMsg() {
  if (lockoutIntervalId) {
    clearInterval(lockoutIntervalId)
    lockoutIntervalId = null
  }
  const messageEl = $('message')
  if (messageEl) messageEl.innerHTML = ''
}

// ── Register Service Worker ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}

// ── Start ──
init()
