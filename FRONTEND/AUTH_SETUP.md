# Authentication Setup Guide - Notes-Flow

## Overview

Notes-Flow includes a comprehensive authentication system with both traditional email/password and Google OAuth support. This guide will help you set up Google OAuth for production use.

## Current Features

- Email/Password Authentication
- Google Sign-Up (Demo)
- Google Sign-In (Demo)
- Protected Routes
- Persistent User Sessions
- User Profile Management

## Setting Up Google OAuth

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project called "Notes-Flow"
3. Enable the Google+ API:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

### Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Select "Web Application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret

### Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# NextAuth
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

To generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Step 4: Update Auth Handler

The app is currently using a Zustand store for state management. To enable real Google OAuth, you'll need to:

1. Set up NextAuth.js with the Google provider
2. Create an API route for authentication
3. Update the store to use NextAuth sessions

Here's a basic NextAuth setup:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### Step 5: Update Login/Signup Components

Replace the mock Google handlers with real NextAuth calls:

```typescript
// In signup and login pages
import { signIn } from "next-auth/react"

const handleGoogleSignup = async () => {
  await signIn("google", { redirect: true, callbackUrl: "/dashboard" })
}
```

## Mock vs. Production

### Current (Development/Demo)

- Uses Zustand store for state management
- Mock authentication flows
- No database persistence
- Useful for UI/UX testing

### Production Ready

- Implement with real database (Neon, Supabase, etc.)
- Use NextAuth.js for OAuth handling
- Add proper session management
- Implement RLS and security measures

## Frontend Components

### Login Page
- Location: `app/auth/login/page.tsx`
- Features:
  - Google OAuth button
  - Email/password form
  - Form validation
  - Error handling

### Signup Page
- Location: `app/auth/signup/page.tsx`
- Features:
  - Google OAuth button
  - Full registration form
  - Password confirmation
  - Validation rules

### Protected Routes
- All dashboard routes require authentication
- Automatically redirects to login if not authenticated
- Uses `useAuthStore()` for user state

## Store Management

The authentication state is managed by Zustand in `lib/store.ts`:

```typescript
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, password: string) => {
    // Authentication logic
  },
  
  signup: async (name: string, email: string, password: string) => {
    // Registration logic
  },
  
  logout: () => {
    // Logout logic
  },
}))
```

## Database Integration

To make authentication persistent, integrate with:

1. **Neon** (Recommended)
   - PostgreSQL compatibility
   - Built-in RLS support
   - Use with Drizzle ORM

2. **Supabase**
   - PostgreSQL with built-in auth
   - Realtime capabilities
   - Pre-built UI components

3. **Firebase**
   - Managed auth service
   - Easy OAuth integration
   - Limited customization

## Security Best Practices

1. **Environment Variables**: Never commit `.env.local`
2. **HTTPS Only**: Use HTTPS in production
3. **CSRF Protection**: NextAuth handles this automatically
4. **Password Hashing**: Use bcrypt or similar
5. **Session Management**: Set appropriate expiration times
6. **Rate Limiting**: Implement on auth endpoints

## Testing

### Test Google OAuth Flow

1. Visit http://localhost:3000
2. Click "Get Started"
3. Click "Continue with Google"
4. Verify redirect to dashboard

### Test Email/Password Flow

1. Visit http://localhost:3000/auth/signup
2. Fill in all fields
3. Click "Sign Up"
4. Verify redirect to dashboard

## Troubleshooting

### "OAuth redirect URI mismatch"
- Check that redirect URI in Google Console matches your app
- Ensure protocol (http/https) matches exactly
- Verify port number is correct

### "NEXTAUTH_SECRET not found"
- Add `NEXTAUTH_SECRET` to `.env.local`
- Regenerate with: `openssl rand -base64 32`

### "Google button not working"
- Check console for errors
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
- Ensure Google+ API is enabled

## Next Steps

1. Set up your database
2. Configure Google OAuth credentials
3. Implement NextAuth.js
4. Add email verification
5. Set up password reset flow
6. Implement 2FA

For more information, refer to:
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Neon Documentation](https://neon.tech/docs/)
