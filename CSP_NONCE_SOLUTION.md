# CSP 'unsafe-inline' Fix - Solution Options

## Problem

The Content-Security-Policy contains `'unsafe-inline'` in the `script-src` directive, which is a security risk. This allows any inline script to execute, which can be exploited for XSS attacks.

## Current Situation

Your application uses:
- **Inline event handlers** (`onclick`, `onload`, `onerror`, etc.) - ~29 instances
- **Large inline script blocks** - 2 major script sections in the HTML

## Solution Options

### Option 1: Use CSP Nonces (Recommended for Dynamic Sites)

**Pros:**
- More secure than `'unsafe-inline'`
- Allows specific inline scripts

**Cons:**
- Requires server-side nonce generation (not possible with static HTML)
- Would need a build process or server-side rendering

**Not suitable for static HTML on GoDaddy.**

---

### Option 2: Use CSP Hashes (Best for Static Sites)

**Pros:**
- Most secure option for static sites
- No server-side requirements
- Each inline script gets a unique hash

**Cons:**
- Requires calculating SHA256 hashes for each inline script
- If scripts change, hashes must be updated
- More complex to maintain

**This is the best option for your static site.**

---

### Option 3: Remove 'unsafe-inline' and Move Scripts to External Files

**Pros:**
- Most secure
- Clean separation of concerns

**Cons:**
- Major refactoring required
- Would need to move all inline scripts to `.js` files
- Would need to replace all inline event handlers with `addEventListener`

**Best long-term solution, but requires significant work.**

---

### Option 4: Keep 'unsafe-inline' with Additional Protections (Acceptable Risk)

**Pros:**
- No code changes required
- You already have XSS protections in place:
  - Input sanitization (`sanitizeHTML()`, `escapeHtml()`)
  - Content Security Policy (even with unsafe-inline, it still provides protection)
  - Other security headers

**Cons:**
- Still flagged by security scanners
- Less secure than removing unsafe-inline

**Acceptable if you have other XSS protections (which you do).**

---

## Recommended Approach

For your static site on GoDaddy, I recommend **Option 2 (CSP Hashes)** or **Option 4 (Acceptable Risk)**.

### If You Want Maximum Security (Option 2):

1. Calculate SHA256 hashes for all inline scripts
2. Update CSP to use hashes instead of `'unsafe-inline'`
3. Update hashes whenever scripts change

### If You Want Quick Fix (Option 4):

1. Keep `'unsafe-inline'` but document it as acceptable
2. Ensure all user input is sanitized (already done)
3. Monitor for XSS vulnerabilities

---

## Implementation: Option 2 (CSP Hashes)

I'll help you implement CSP hashes. This requires:
1. Extracting all inline scripts
2. Calculating SHA256 hashes
3. Updating the CSP header

Would you like me to:
- **A)** Calculate hashes and update CSP (recommended)
- **B)** Keep unsafe-inline but improve other security (quick fix)
- **C)** Refactor to move scripts to external files (long-term)

Let me know which option you prefer!

