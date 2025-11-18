# Public Side Security Review

## Overview
This document tracks security vulnerabilities and fixes for the public-facing `public.html` page.

## Critical Issues

### 1. XSS Vulnerability - Profile Photo URL (Line 587) ✅ FIXED
**Risk:** High  
**Location:** `renderProfile()` function  
**Issue:** User-controlled `profile.profile_photo` is inserted directly into `innerHTML` without sanitization.

**Fix Applied:**
- Added `sanitizeImageUrl()` function that validates URL protocol (only allows http://, https://, or data:image/)
- Blocks dangerous protocols (javascript:, vbscript:, etc.)
- Checks for common XSS patterns in URLs
- Changed from `innerHTML` to safe DOM element creation using `createElement()` and `appendChild()`
- Added `sanitizeTransformValue()` function to sanitize CSS transform values (bonus fix for CSS injection)
- Invalid URLs now show default avatar instead of rendering malicious content

---

### 2. XSS Vulnerability - Link Title (Line 706) ✅ FIXED
**Risk:** High  
**Location:** `renderLinks()` function  
**Issue:** User-controlled `link.title` is inserted directly into `innerHTML` without sanitization.

**Fix Applied:**
- Added `sanitizeHTML()` function that safely allows only formatting tags (`<strong>`, `<em>`, `<u>`, `<b>`, `<i>`)
- Strips all other HTML tags and attributes to prevent XSS
- Uses DOMParser to safely parse HTML without executing scripts
- Updated `renderLinks()` to use `sanitizeHTML(link.title || '')` instead of direct assignment
- Preserves safe HTML formatting (bold, italic, underline) while preventing XSS attacks

---

### 3. Missing Passkey Authentication ✅ FIXED
**Risk:** High  
**Location:** `loadProfile()` function  
**Issue:** Collections with `visibility: 'passkey'` are not protected. Anyone with the URL can access them.

**Fix Applied:**
- Added passkey authentication modal with user-friendly UI
- Check if collection has `passkey` field set (non-empty)
- Prompt for passkey before displaying any content
- Validate passkey using case-sensitive comparison
- Store validated passkey in `sessionStorage` to avoid re-prompting during the same session
- Hide content while passkey modal is shown (prevents content preview)
- Show error message for incorrect passkey attempts
- Support Enter key submission for better UX
- Separate `loadCollectionContent()` function to handle content loading after passkey validation

---

### 4. XSS Vulnerability - Social Media URLs (Line 639) ✅ FIXED
**Risk:** Medium  
**Location:** `renderSocialLinks()` function  
**Issue:** User-controlled social media URLs are set directly without validation.

**Fix Applied:**
- Added `sanitizeUrl()` function that validates URLs:
  - Only allows `http://` and `https://` protocols
  - Blocks `javascript:`, `vbscript:`, `data:`, and other dangerous protocols
  - Checks for common XSS patterns in URLs
- Added `isValidEmail()` function to validate email addresses
- Updated `renderSocialLinks()` to:
  - Validate email addresses before creating `mailto:` links
  - Escape email addresses using `encodeURIComponent()` to prevent XSS
  - Validate and sanitize all social media URLs before setting `href`
  - Skip invalid URLs/emails instead of rendering them (prevents broken links)

---

### 5. CSS Injection - Profile Photo Position (Line 580) ✅ FIXED
**Risk:** Medium  
**Location:** `renderProfile()` function  
**Issue:** User-controlled `profile.profile_photo_position` JSON is parsed and used in CSS transform without sanitization.

**Fix Applied:**
- Added `sanitizeTransformValue()` function that validates and clamps numeric values
- Scale values are clamped between 10-500 (0.1x to 5.0x)
- X and Y position values are clamped between 0-100
- Invalid values default to safe defaults (100 for scale, 50 for x/y)
- Values are sanitized before being used in CSS transform

---

## Medium Issues

### 6. Missing URL Parameter Validation ✅ FIXED
**Risk:** Medium  
**Location:** Lines 339-341  
**Issue:** `userId` and `collectionId` are extracted from URL params without format validation.

**Fix Applied:**
- Added `isValidUUID()` function to validate UUID v4 format (8-4-4-4-12 hexadecimal characters)
- Added `isValidUserId()` function to validate user ID format (exactly 12 hexadecimal characters)
- Added `validateUrlParameters()` function that:
  - Validates both parameters before use
  - Returns validation result with error messages
  - Normalizes parameters to lowercase for consistency
  - Trims whitespace
- Added `showError()` function to display user-friendly error messages
- Updated `loadProfile()` to check validation before proceeding
- Updated page initialization to validate parameters on load
- Invalid parameters now show clear error messages instead of failing silently

---

### 7. Signed URL Tokens in HTML (Lines 7-8) ✅ FIXED
**Risk:** Medium  
**Location:** Favicon and apple-touch-icon links  
**Issue:** Uses signed URLs with expiring tokens instead of public URLs.

**Fix Applied:**
- Replaced signed URLs with public URLs (matching `index.html`)
- Removed expiring token parameters
- Now uses stable public URLs that won't expire

---

### 8. Missing SRI Hashes for CDN Resources ✅ FIXED
**Risk:** Medium  
**Location:** Lines 12-14  
**Issue:** CDN scripts and stylesheets don't have SRI hashes or version pinning.

**Fix Applied:**
- Pinned Supabase JS to version `2.75.1` (matching `index.html`) with SRI hash
- Updated QRCode.js to version `1.0.0` (matching `index.html`) with SRI hash
- Updated Font Awesome to version `6.4.2` (matching `index.html`) with SRI hash
- Added `integrity` attributes with SHA384 hashes for all CDN resources
- Added `crossorigin="anonymous"` attributes for all CDN resources
- Added `referrerpolicy="no-referrer"` to Font Awesome stylesheet
- All CDN resources now have version pinning and integrity verification

---

### 9. Information Disclosure - Error Messages
**Risk:** Low  
**Location:** Multiple `console.error()` statements  
**Issue:** Error messages may reveal sensitive information about collection existence, database structure, etc.

**Fix Required:** Use generic error messages, avoid logging sensitive data.

---

## Low Priority Issues

### 10. Missing Security Headers
**Risk:** Low  
**Issue:** `public.html` should have the same security headers as `index.html` (CSP, X-Frame-Options, etc.).

**Note:** Headers are typically set server-side, but should be documented.

---

## Summary

**Critical Issues:** 3  
**Medium Issues:** 6  
**Low Priority Issues:** 1

**Total Issues:** 10

## Fix Priority

1. **Immediate (Critical):**
   - Fix XSS vulnerabilities (profile photo, link title, social URLs)
   - Implement passkey authentication
   - Fix CSS injection in profile photo position

2. **High Priority (Medium):**
   - Add URL parameter validation
   - Replace signed URLs with public URLs
   - Add SRI hashes to CDN resources

3. **Nice to Have (Low):**
   - Improve error message handling
   - Document security headers

