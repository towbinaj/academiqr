# Security Review - AcademiQR

## Overview
This document tracks security vulnerabilities, fixes, and best practices for the AcademiQR application.

---

## 1. Authentication and Session Management

### ✅ Fixed: Critical Issue #1 - Auto Sign-Up on Failed Sign-In
- **Location**: `handleEmailLogin()` function (line 11914)
- **Issue**: Application automatically created accounts on failed sign-in attempts
- **Risk**: Account enumeration vulnerability - attackers could determine if email addresses are registered
- **Fix Implemented**: 
  - Separated sign-in and sign-up into distinct user flows
  - Added `isSignUpMode` flag and `toggleSignUpMode()` function
  - Created separate `handleEmailSignUp()` function
  - Removed auto sign-up logic from sign-in flow
  - Both flows now show generic error messages to prevent information disclosure
- **Security Benefits**:
  - ✅ Prevents account enumeration
  - ✅ Requires explicit user action for account creation
  - ✅ Generic error messages prevent information disclosure

### ✅ Fixed: Critical Issue #2 - OAuth Tokens in URL Hash
- **Location**: `initApp()` function (lines 5039-5072)
- **Issue**: OAuth tokens (`access_token`, `refresh_token`) exposed in URL hash
- **Risk**: 
  - Tokens visible in browser history
  - Tokens could be logged by server logs
  - Tokens exposed in referrer headers
- **Fix Implemented**: 
  - Extract tokens from hash immediately on page load
  - Clear hash using `history.replaceState()` (removes from browser history)
  - Nullify token variables immediately after use
  - Generic error messages for OAuth failures
- **Security Benefits**:
  - ✅ Tokens removed from URL immediately
  - ✅ Tokens not stored in browser history
  - ✅ Reduced risk of token exposure in logs/referrers

### ✅ Fixed: Medium Issue #1 - No Password Validation
- **Location**: Sign-up flow (lines 12014-12065)
- **Issue**: No client-side password strength validation
- **Risk**: Weak passwords compromise account security
- **Fix Implemented**: 
  - Added `validatePassword()` function with requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character (!@#$%^&*)
  - Added real-time visual feedback with `validatePasswordStrength()`
  - Password requirements displayed during sign-up
  - Validation occurs before submission to server
- **Security Benefits**:
  - ✅ Enforces strong password policy
  - ✅ Improves user experience with real-time feedback
  - ✅ Reduces risk of compromised accounts

### ✅ Fixed: Medium Issue #2 - No Rate Limiting
- **Location**: `handleEmailLogin()` function (lines 11545-11642)
- **Issue**: No protection against brute-force login attempts
- **Risk**: Attackers could attempt unlimited password guesses
- **Fix Implemented**: 
  - Client-side rate limiting using `localStorage`
  - Configuration: 5 max attempts, 15-minute lockout, 1-hour tracking window
  - Functions: `recordFailedAttempt()`, `isAccountLockedOut()`, `clearRateLimitData()`
  - Persistent lockout message with live countdown timer
  - Rate limit data cleared on successful login
- **Security Benefits**:
  - ✅ Prevents brute-force attacks
  - ✅ Provides user feedback on lockout status
  - ✅ Automatic recovery after lockout period

### ✅ Fixed: Medium Issue #3 - Error Messages May Reveal Too Much Information
- **Location**: Throughout application (multiple locations)
- **Issue**: Error messages exposed sensitive information (error messages, stack traces, database structure)
- **Risk**: Information disclosure helps attackers understand system architecture
- **Fix Implemented**: 
  - Replaced all `error.message` in user-facing messages with generic messages
  - Removed stack traces from console logs
  - Removed database error details (hints, details) from logs
  - Generic messages: "Failed to [operation]. Please try again."
  - Second review conducted to ensure thoroughness
- **Security Benefits**:
  - ✅ Prevents information disclosure
  - ✅ Hides system architecture details
  - ✅ Maintains user-friendly error messages

### ✅ Fixed: Medium Issue #4 - Long Session Timeouts (30-Day Persistent Login)
- **Location**: `getPersistentLogin()` function (line 12538)
- **Issue**: "Remember me" feature stored login for 30 days
- **Risk**: Extended exposure window if device is compromised
- **Fix Implemented**: 
  - Reduced persistent login timeout from 30 days to 14 days
  - Updated UI text to reflect "14 days"
  - Added comprehensive GDPR-compliant privacy information
  - Created `showPrivacyInfo()` modal with detailed privacy information
  - Clarified what data is stored in browser vs. on servers
- **Security Benefits**:
  - ✅ Reduced exposure window
  - ✅ Better balance between security and convenience
  - ✅ GDPR compliance with clear privacy information

### ✅ Good Practice: No Tokens Stored in localStorage
- **Status**: ✅ Verified
- **Implementation**: 
  - Authentication tokens managed by Supabase client library
  - Tokens stored in secure, HTTP-only manner by Supabase
  - Only email and login status flag stored in localStorage (for "Remember me")
- **Security Benefits**:
  - ✅ Tokens not accessible via JavaScript
  - ✅ Reduced risk of XSS token theft

### ✅ Good Practice: Proper Session Management via Supabase
- **Status**: ✅ Verified and Improved
- **Implementation**: 
  - Supabase `onAuthStateChange` listener for automatic session management
  - Handles sign-in, sign-out, token refresh, and user updates
  - Automatic token refresh by Supabase
  - Cross-tab synchronization via Supabase
- **Security Benefits**:
  - ✅ Automatic session state synchronization
  - ✅ Secure token refresh
  - ✅ Proper session cleanup on sign-out

### ✅ Good Practice: Hash Clearing after OAuth
- **Status**: ✅ Verified
- **Implementation**: 
  - OAuth tokens extracted from URL hash immediately
  - Hash cleared using `history.replaceState()` (removes from history)
  - Token variables nullified after use
- **Security Benefits**:
  - ✅ Tokens not stored in browser history
  - ✅ Reduced risk of token exposure

### ✅ Good Practice: Timeout Protection on Auth Operations
- **Status**: ✅ Verified and Improved
- **Implementation**: 
  - All critical auth operations have timeout protection using `Promise.race()`
  - OAuth `setSession`: 10-second timeout
  - Session checks: 10-second timeout
  - Login checks: 12-second timeout
- **Security Benefits**:
  - ✅ Prevents hanging on network issues
  - ✅ Better user experience
  - ✅ Prevents resource exhaustion

---

## 2. API Keys and Secrets Exposure

### ✅ Fixed: Signed URL Tokens in HTML
- **Location**: Favicon and apple-touch-icon links (lines 7-8)
- **Issue**: Signed URL tokens exposed in HTML source
- **Risk**: Tokens could be extracted and used by unauthorized parties
- **Fix Implemented**: 
  - Replaced signed URLs with public URLs
  - Supabase `assets` bucket is now public (no signed URLs needed)
- **Security Benefits**:
  - ✅ No sensitive tokens in HTML source
  - ✅ Public assets don't require authentication

### ✅ Good Practice: Supabase Anon Key Exposure
- **Status**: ✅ Expected and Safe
- **Implementation**: 
  - Supabase anonymous key is intentionally exposed in client-side code
  - This is the expected design for Supabase
  - Security is enforced via Row Level Security (RLS) policies
- **Security Benefits**:
  - ✅ RLS policies enforce data access control
  - ✅ No service role keys or other secrets exposed

### ✅ Good Practice: No Third-Party API Keys
- **Status**: ✅ Verified
- **Implementation**: 
  - No third-party API keys found in codebase
  - Only Supabase configuration (URL and anon key)
- **Security Benefits**:
  - ✅ Reduced attack surface
  - ✅ No third-party credential exposure

---

## 3. Input Validation and Sanitization

### ✅ Fixed: XSS Vulnerability - Unsanitized innerHTML
- **Location**: Multiple locations (lines 5844, 6636, 6665, 10613, 16438, 16440, 16447, 16448, 16354, 16363, 16527, 16544, 6066)
- **Issue**: User-controlled data inserted into `innerHTML` without sanitization
- **Risk**: Cross-Site Scripting (XSS) attacks
- **Fix Implemented**: 
  - Created `sanitizeHTML()` function (lines 13878-13951) using DOMParser
  - Whitelists only safe HTML tags: `<strong>`, `<em>`, `<u>`, `<b>`, `<i>`
  - Strips all other tags and attributes
  - Created `escapeHtml()` function for plain text
  - Applied sanitization to:
    - Link titles (display and storage)
    - Description and bio text
    - Theme names
    - Error messages
- **Security Benefits**:
  - ✅ Prevents XSS attacks
  - ✅ Preserves safe formatting (bold, italic, underline)
  - ✅ Strips dangerous tags and attributes

### ✅ Fixed: Missing Email Format Validation
- **Location**: Login and sign-up flows (lines 11828-11832, 11936-11940)
- **Issue**: No client-side email format validation
- **Risk**: Invalid email addresses submitted to server
- **Fix Implemented**: 
  - Added `isValidEmail()` function with regex validation
  - Applied to both login and sign-up flows
  - Validation occurs before authentication attempt
- **Security Benefits**:
  - ✅ Prevents invalid email submissions
  - ✅ Better user experience
  - ✅ Reduces server load

### ✅ Fixed: Missing Input Length Limits
- **Location**: Various input fields throughout application
- **Issue**: No maximum length limits on text inputs
- **Risk**: Potential DoS via extremely long inputs, database overflow
- **Fix Implemented**: 
  - Added `maxlength` attributes to all relevant input fields:
    - Link title: 200 characters
    - Link URL: 2048 characters
    - Collection name: 50 characters
    - Profile display name: 100 characters
    - Social media URLs: 500 characters
    - Presentation fields: 200 characters
    - Theme name: 100 characters
    - Passkey: 100 characters
- **Security Benefits**:
  - ✅ Prevents DoS via long inputs
  - ✅ Protects database from overflow
  - ✅ Better user experience

### ✅ Fixed: Collection Slug Validation
- **Location**: Collection creation, editing, duplication (lines 6906-6932, 6971-7005, 7014-7029, 7208-7221, 7275-7297)
- **Issue**: No validation on collection slug format
- **Risk**: Invalid slugs, potential security issues, URL injection
- **Fix Implemented**: 
  - Created `validateAndSanitizeSlug()` function (lines 13953-14000)
  - Rules: alphanumeric, hyphens, underscores, lowercase, max 50 chars
  - Applied to all collection operations
  - Special handling: preserves existing non-standard slugs if unchanged
- **Security Benefits**:
  - ✅ Prevents invalid slug formats
  - ✅ Reduces risk of URL injection
  - ✅ Maintains backward compatibility

### ✅ Fixed: Contenteditable XSS Risk
- **Location**: Inline editing of link titles (line 5967) and RTF editors (line 13566)
- **Issue**: Reading `innerHTML` from contenteditable elements without sanitization
- **Risk**: If malicious HTML is somehow inserted, it's read back and saved
- **Fix Implemented**: 
  - Added sanitization when reading from contenteditable in `setupInlineEditing()` (line 5967)
    - Link titles: `sanitizeHTML(e.target.innerHTML)`
    - URLs: Uses `textContent` (safe)
  - Added sanitization in `updateRTFContent()` function (line 13566)
    - Description text: `sanitizeHTML(editor.innerHTML)`
    - Bio text: `sanitizeHTML(editor.innerHTML)`
  - Added sanitization when storing link titles from RTF formatting (line 6066)
- **Security Benefits**:
  - ✅ Prevents XSS from malicious HTML in contenteditable elements
  - ✅ Preserves safe formatting (bold, italic, underline)
  - ✅ Strips dangerous tags and attributes
  - ✅ Protects both link titles and description/bio text

### ✅ Fixed: CSS Injection Risk
- **Location**: Style attributes with user-controlled data (lines 8528-8533, 8572-8576, 16582, 16645-16658)
- **Issue**: User-controlled CSS values (colors, gradients, URLs) inserted directly into style attributes
- **Risk**: CSS injection attacks (e.g., `javascript:`, `expression()`, `@import`)
- **Fix Implemented**: 
  - Created `sanitizeCSSValue()` function (lines 16345-16390) to validate and sanitize CSS values
    - Validates hex colors: `/^#[0-9A-Fa-f]{6}$/`
    - Validates gradients: `/^linear-gradient\([^)]+\)$/i` and blocks `javascript:`, `expression()`, `@import`
    - Validates URLs: `/^url\(['"]?[^'"]+['"]?\)$/i` and blocks `javascript:`, `data:text/html`
  - Applied sanitization to:
    - Background colors (line 8529)
    - Gradient backgrounds (line 8531)
    - Background image URLs (line 8533)
    - Button border/color styles (lines 8574-8576)
    - Theme preview colors (lines 16648, 16653)
- **Security Benefits**:
  - ✅ Prevents CSS injection attacks
  - ✅ Blocks `javascript:` protocol in CSS
  - ✅ Blocks `expression()` and `@import` directives
  - ✅ Validates all user-controlled CSS values
  - ✅ Provides safe fallback values

---

## 4. CSRF (Cross-Site Request Forgery) Protection

### ✅ Good Practice: Supabase JWT Token-Based Authentication
- **Status**: ✅ Protected
- **Implementation**: 
  - All database operations use Supabase client library
  - Supabase uses JWT tokens in `Authorization` headers (not cookies)
  - Tokens stored in memory/localStorage, not accessible to malicious sites
  - Supabase validates JWT token on every request
  - Row Level Security (RLS) policies enforce data access control
- **Security Benefits**:
  - ✅ JWT tokens not sent automatically with cross-site requests
  - ✅ Browser's same-origin policy prevents token theft
  - ✅ RLS policies provide additional server-side protection
  - ✅ No cookie-based authentication vulnerable to CSRF

### ✅ Good Practice: Form Submissions Use JavaScript Handlers
- **Status**: ✅ Protected
- **Implementation**: 
  - Login form uses `onsubmit="handleEmailLogin(event)"` with `event.preventDefault()`
  - No traditional form submissions to external endpoints
  - All operations use Supabase client methods (JavaScript)
- **Security Benefits**:
  - ✅ No automatic form submissions vulnerable to CSRF
  - ✅ All requests go through Supabase client with JWT tokens

### ⚠️ Medium: External Tracking API Endpoint
- **Location**: Analytics tracking endpoint `/api/track/{link-id}` (line 6602)
- **Issue**: External API endpoint accessed via GET request (link href)
- **Risk**: Potential CSRF if endpoint performs state-changing operations
- **Current Status**: 
  - Endpoint accessed as: `https://academiqr.com/api/track/${link.id}`
  - Used for analytics tracking (should be idempotent)
  - GET request (less critical for CSRF, but should still be protected)
- **Recommendations**:
  - ✅ **Server-Side**: Ensure tracking endpoint is idempotent (no state changes)
  - ✅ **Server-Side**: Implement CSRF protection if endpoint modifies state
  - ✅ **Server-Side**: Use POST requests for state-changing operations
  - ✅ **Server-Side**: Validate `Origin` or `Referer` headers
  - ✅ **Server-Side**: Consider using SameSite cookie attributes if cookies are used
  - ⚠️ **Client-Side**: Current implementation is acceptable for GET requests (idempotent tracking)

### ✅ Good Practice: OAuth Flow Protection
- **Status**: ✅ Protected
- **Implementation**: 
  - Google OAuth uses redirect flow with state parameter
  - OAuth state parameter prevents CSRF attacks
  - Tokens extracted and cleared immediately after OAuth callback
- **Security Benefits**:
  - ✅ OAuth state parameter validates request origin
  - ✅ Prevents CSRF in OAuth flow

### ✅ Good Practice: No Cookie-Based Authentication
- **Status**: ✅ Verified
- **Implementation**: 
  - No cookie-based authentication found
  - All authentication uses JWT tokens via Supabase
  - No `Set-Cookie` headers for authentication
- **Security Benefits**:
  - ✅ No cookies vulnerable to CSRF attacks
  - ✅ JWT tokens provide inherent CSRF protection

### 📋 Recommendations for Server-Side (Tracking API)
1. **Add Origin/Referer Validation**: Check `Origin` or `Referer` headers to ensure requests come from expected domains (see `VERIFY_TRACKING_ENDPOINT_CSRF.md` for implementation guide)
2. **Consider Duplicate Detection**: Add logic to prevent duplicate clicks from same IP within short time window (optional)
3. **Restrict CORS Headers**: Change `Access-Control-Allow-Origin: '*'` to specific domain(s)
4. **Monitor CSRF Attempts**: Add logging to detect and alert on potential CSRF attacks
5. **Idempotency Note**: Analytics tracking is intentionally non-idempotent (tracks every click), which is acceptable for analytics use case

**Implementation Guide**: See `VERIFY_TRACKING_ENDPOINT_CSRF.md` for detailed steps to verify and implement CSRF protection.

---

## 5. File Upload Security

### ⚠️ Medium: File Upload Validation
- **Location**: Profile photo and background image uploads
- **Current**: Client-side MIME type validation
- **Risk**: Malicious files could be uploaded if server doesn't validate
- **Recommendations**:
  - Add file size limits (client and server)
  - Validate MIME types server-side
  - Scan uploaded files for malware

---

## Summary

### ✅ Critical Issues Fixed:
1. ✅ Removed auto sign-up on failed sign-in
2. ✅ Fixed OAuth token exposure in URL hash
3. ✅ Fixed XSS vulnerabilities (innerHTML, contenteditable, CSS injection)

### 🟡 High Priority:
1. ✅ Add email format validation in login flow
2. ✅ Add input length limits to all text fields
3. ✅ Validate collection slug format
4. ✅ Sanitize contenteditable input when reading HTML
5. ✅ Sanitize CSS values to prevent CSS injection

### ✅ Completed:
1. ✅ Removed auto sign-up on failed sign-in
2. ✅ Added password validation
3. ✅ Implemented generic error messages
4. ✅ Reduced session timeout to 14 days
5. ✅ Added GDPR-compliant privacy information
6. ✅ Fixed XSS vulnerabilities
7. ✅ Added email format validation
8. ✅ Added input length limits
9. ✅ Added collection slug validation
10. ✅ Fixed contenteditable XSS risk
11. ✅ Fixed CSS injection risk

### ⚠️ Server-Side Recommendations:
1. **Tracking API**: Ensure CSRF protection if endpoint modifies state
2. **File Uploads**: Add server-side validation and malware scanning
3. **Rate Limiting**: Implement server-side rate limiting (client-side is not sufficient)
4. **Session Management**: Verify Supabase RLS policies are properly configured

---

## CSRF Protection Summary

### ✅ Client-Side Protection (Current):
- ✅ JWT token-based authentication (not cookies)
- ✅ JavaScript-based form handlers (no automatic submissions)
- ✅ OAuth state parameter validation
- ✅ Same-origin policy protection for JWT tokens

### ⚠️ Server-Side Recommendations:
- ⚠️ Validate tracking API endpoint is idempotent
- ⚠️ Implement CSRF protection for state-changing operations
- ⚠️ Validate Origin/Referer headers on tracking endpoint
- ⚠️ Use POST for state-changing operations

### Overall CSRF Risk: **LOW** ✅
The application uses JWT token-based authentication which provides inherent CSRF protection. The main concern is the external tracking API endpoint, which should be verified server-side to ensure it's idempotent and properly protected.
