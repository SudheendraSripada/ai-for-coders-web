# Authentication Architecture

## Overview
This document explains the authentication architecture for the AI Coding Platform. The system uses Supabase Auth with Next.js 15 App Router, following best practices for SSR-safe, cross-device authentication.

## Key Principles

### 1. Cookie-Based Sessions (Not localStorage)
- **Why**: Works with SSR, Vercel Edge, and cross-device scenarios
- **How**: `@supabase/ssr` package handles cookie management automatically
- **Location**: `middleware.ts` and client components both use cookies

### 2. AuthProvider as Single Source of Truth
- **Location**: `components/AuthProvider.tsx`
- **Purpose**: Global auth state listener that controls ALL navigation
- **Events Handled**:
  - `SIGNED_IN` → Dashboard (if email confirmed) or `/verify-email`
  - `SIGNED_OUT` → Login page
  - `USER_UPDATED` → Handle email confirmation completion
  - `TOKEN_REFRESHED` → Silent refresh

### 3. No Manual Redirects After Login
- Login/signup forms do NOT call `router.push()`
- AuthProvider listener automatically handles navigation based on auth state
- This ensures consistent behavior and prevents race conditions

## Authentication Flows

### Email/Password Signup Flow

```
1. User submits signup form
   ↓
2. POST /api/auth/signup
   - Calls supabase.auth.signUp()
   - Sends confirmation email with link to /auth/confirm
   ↓
3. User redirected to /verify-email
   - Shows "Check your email" message
   ↓
4. User clicks link in email (any device/browser)
   ↓
5. /auth/confirm?token_hash=XXX&type=signup
   - Uses verifyOtp() with token_hash (NOT exchangeCodeForSession)
   - Creates user profile
   - Sets loading=false (no manual redirect)
   ↓
6. AuthProvider detects SIGNED_IN or USER_UPDATED event
   - Automatically redirects to /welcome
   ↓
7. Welcome page
   - User can navigate to dashboard
```

### Email/Password Login Flow

```
1. User submits login form
   ↓
2. POST /api/auth/login
   - Calls supabase.auth.signInWithPassword()
   - Returns success (NO manual redirect)
   ↓
3. AuthProvider detects SIGNED_IN event
   - Automatically redirects to /dashboard
```

### Magic Link Flow

```
1. User enters email on /auth/magic-link
   ↓
2. supabase.auth.signInWithOtp()
   - Sends magic link to /auth/confirm
   ↓
3. User clicks link (any device/browser)
   ↓
4. /auth/confirm?token_hash=XXX&type=magiclink
   - Uses verifyOtp() with token_hash
   ↓
5. AuthProvider detects SIGNED_IN
   - Redirects to /dashboard or /welcome
```

## Critical Implementation Details

### ❌ NEVER Do This
```typescript
// WRONG: exchangeCodeForSession is ONLY for OAuth (Google, GitHub, etc.)
if (code) {
  await supabase.auth.exchangeCodeForSession(code) // ❌ Breaks cross-device
}
```

### ✅ Always Do This
```typescript
// CORRECT: verifyOtp works cross-device for email confirmations
if (token_hash && type) {
  await supabase.auth.verifyOtp({
    token_hash,
    type // 'signup', 'magiclink', 'recovery', etc.
  })
}
```

### Why exchangeCodeForSession Fails for Email

**PKCE (Proof Key for Code Exchange)**:
- OAuth flows store a code verifier in localStorage on the SAME device
- Email links are opened on ANY device/browser
- No verifier = "PKCE code verifier not found" error

**Solution**:
- Use `verifyOtp()` for ALL email-based flows
- Supabase verifies token_hash server-side (no localStorage needed)

## File Structure

```
middleware.ts                    # Route protection (SSR-safe)
components/AuthProvider.tsx      # Global auth listener (client-side)

app/auth/
  ├── confirm/page.tsx          # Email confirmation handler (token_hash)
  ├── callback/page.tsx         # OAuth callback handler (code)
  ├── login/page.tsx            # Email/password login
  ├── signup/page.tsx           # Email/password signup
  ├── magic-link/page.tsx       # Magic link sender
  └── ...

app/verify-email/page.tsx       # "Check your email" page
app/welcome/page.tsx            # Post-confirmation welcome
```

## Middleware Configuration

The `middleware.ts` file is properly configured for Next.js 15:

```typescript
export const config = {
  matcher: [
    '/dashboard/:path*',     // Protected routes
    '/explore/:path*',
    '/auth/login',           // Auth routes (redirect if logged in)
    '/auth/signup',
    '/auth/confirm',         # Email confirmation
    '/auth/callback',        # OAuth callback
    '/verify-email',
    '/welcome',
  ],
}
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Email Templates

Email templates must use the correct redirect URLs:

**Confirm Signup Template**:
```html
<a href="{{ .ConfirmationURL }}">Confirm your email</a>
```

This generates: `https://your-domain.com/auth/confirm?token_hash=XXX&type=signup`

**Magic Link Template**:
```html
<a href="{{ .ConfirmationURL }}">Sign in with magic link</a>
```

This generates: `https://your-domain.com/auth/confirm?token_hash=XXX&type=magiclink`

## Debugging Tips

### Check Auth State
```typescript
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
console.log('Email confirmed:', session?.user.email_confirmed_at)
```

### Listen to Auth Events
Already implemented in AuthProvider. Check console for:
```
Auth state changed: SIGNED_IN user@example.com on path: /auth/confirm
```

### Common Errors

**"PKCE code verifier not found"**
- You're using `exchangeCodeForSession()` for email confirmation
- Solution: Use `verifyOtp()` instead

**"Invalid confirmation link"**
- Link expired (default: 24 hours)
- Link already used
- Wrong redirect URL in Supabase settings

**Email not confirmed after clicking link**
- Check browser console for errors
- Verify AuthProvider is mounted in layout
- Check middleware matcher includes /auth/confirm

## Testing Checklist

- [ ] Signup → email arrives
- [ ] Click confirm link on DIFFERENT browser/device
- [ ] Redirect to /welcome
- [ ] Login with password → /dashboard
- [ ] Magic link → /dashboard
- [ ] Logout → /auth/login
- [ ] Browser refresh maintains session
- [ ] No PKCE errors in console
- [ ] No manual redirects in login/signup forms

## Security Notes

1. **Email Confirmation Required**: Middleware blocks dashboard access if `email_confirmed_at` is null
2. **Token Expiry**: Confirmation tokens expire after 24 hours (configurable in Supabase)
3. **Rate Limiting**: Supabase has built-in rate limiting for auth endpoints
4. **HTTPS Required**: Always use HTTPS in production for cookie security

## Future Enhancements

- [ ] Add OAuth providers (Google, GitHub)
- [ ] Implement password reset flow
- [ ] Add 2FA support
- [ ] Add session management UI (view/revoke sessions)
- [ ] Add email change flow with re-verification
