# Google Login/Signup Issues - Root Causes & Fixes

## 🔴 Problems You Were Facing

### Issue 1: Google Login Not Working

**Symptom:** Clicked "Sign in with Google" button, but nothing happened or got redirect errors

**Root Cause:**

- The auth store had a mock `googleLogin()` function that didn't actually call the API
- Frontend didn't know how to get the Google OAuth URL from backend
- No proper integration between frontend and backend OAuth endpoints

**Fix Applied:**

```typescript
// BEFORE (mock):
googleLogin: async (token: string) => {
  // Fake implementation, didn't call real API
  const mockUser: User = { ... }
  set({ user: mockUser, isAuthenticated: true, accessToken: "mock-token" })
}

// AFTER (real):
// In login page, now directly calls the API:
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/auth/google`)
const data = await response.json()
window.location.href = data.data.url  // Redirects to Google
```

### Issue 2: Google Redirects Back But Page Breaks

**Symptom:** Got redirected to Google, authenticated, but then showed blank page or error

**Root Cause:**

- Backend used hardcoded `http://localhost:3000` for redirect URL
- If frontend wasn't on that URL, redirect failed
- No error handling for when redirect fails
- Frontend's auth state wasn't initialized after redirect

**Fix Applied:**

```javascript
// BEFORE (bad):
return res
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .redirect("http://localhost:3000/dashboard"); // ❌ Hardcoded

// AFTER (good):
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"; // ✅ From env
res
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions);
return res.redirect(`${frontendUrl}/dashboard?auth=success`);

// Also added error handling:
return res.redirect(`${frontendUrl}/auth/login?error=google_auth_failed`);
```

### Issue 3: New User Signup with Google Didn't Work

**Symptom:** New Google user got redirected to complete-signup, but form submission didn't work

**Root Cause:**

- Frontend store had mock `googleSignup()` function
- Wasn't actually calling the backend endpoint
- No error handling for validation errors

**Fix Applied:**

```typescript
// BEFORE (mock):
googleSignup: async (token: string, username: string) => {
  // Fake implementation
  const mockUser: User = { ... }
  set({ user: mockUser, isAuthenticated: true })
}

// AFTER (real):
googleSignup: async (token: string, username: string) => {
  try {
    const response = await authAPI.completeGoogleSignup({ username, token })
    const { user, accessToken } = response.data.data
    set({
      user: { ...user, id: userId },
      isAuthenticated: true,
      accessToken,
    })
    localStorage.setItem("accessToken", accessToken)
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Google signup failed"
    set({ error: errorMsg })
    throw error
  }
}
```

### Issue 4: Auth State Lost After Page Reload

**Symptom:** Logged in successfully, but refreshing page logged you out

**Root Cause:**

- Frontend didn't initialize auth state on page load
- Token was in localStorage but app didn't know about it
- No auth provider or layout-level initialization

**Fix Applied:**

```typescript
// Created AuthProvider component:
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()  // ✅ Runs on app load
  }, [initializeAuth])

  return <>{children}</>
}

// Updated root layout to use it:
<AuthProvider>
  {children}
</AuthProvider>
```

### Issue 5: OAuth Callback Parameter Issues

**Symptom:** Workspace routes had inconsistent parameter names

**Root Cause:**

- Routes defined as `/:workspaceId` but controllers used `req.params.id`
- Inconsistency meant values were undefined

**Fix Applied:**

```javascript
// BEFORE (inconsistent):
getWorkSpace = asyncHandler(async (req, res) => {
  const workSpace = await Workspace.findById(req.params.id)  // ❌ Wrong param
  ...
})

// AFTER (consistent):
getWorkSpace = asyncHandler(async (req, res) => {
  const workSpace = await Workspace.findById(req.params.workspaceId)  // ✅ Matches route
  ...
})
```

---

## ✅ What Was Fixed

### Backend

| Issue                         | Fix                                 | File                    |
| ----------------------------- | ----------------------------------- | ----------------------- |
| Hardcoded frontend URL        | Use FRONTEND_URL env var            | auth.controller.js      |
| No error handling in OAuth    | Added try-catch with error redirect | auth.controller.js      |
| Inconsistent route parameters | Changed id to workspaceId           | workspace.controller.js |
| Missing environment variables | Added FRONTEND_URL to .env          | .env                    |

### Frontend

| Issue                         | Fix                            | File                |
| ----------------------------- | ------------------------------ | ------------------- |
| Mock Google login             | Real API call to get OAuth URL | auth/login/page.tsx |
| Mock Google signup            | Real API call to backend       | lib/store.ts        |
| Mock email login/signup       | Real API calls                 | lib/store.ts        |
| No auth initialization        | Created AuthProvider           | auth-provider.tsx   |
| No auth on page reload        | Added initializeAuth()         | lib/store.ts        |
| Layout didn't initialize auth | Added AuthProvider to layout   | app/layout.tsx      |
| Missing API client            | Created axios-based client     | lib/api-client.ts   |

---

## 📊 Complete Google OAuth Flow Now

### For Existing User Logging In

```
1. User visits http://localhost:3000/auth/login
2. Clicks "Sign in with Google" button
   ↓
3. Frontend calls: GET /api/v1/auth/auth/google
   ↓
4. Backend generates Google consent URL using GOOGLE_CLIENT_ID
   ↓
5. Backend returns: { url: "https://accounts.google.com/o/oauth2/v2/auth?..." }
   ↓
6. Frontend redirects: window.location.href = url
   ↓
7. Browser goes to Google's login page
   ↓
8. User signs in with Google
   ↓
9. Google redirects back to: /api/v1/auth/google/callback?code=...&state=...
   ↓
10. Backend receives code from Google
    ↓
11. Backend exchanges code for access token from Google
    ↓
12. Backend gets user info: email, googleId, name from Google
    ↓
13. Backend queries MongoDB for user with this email or googleId
    ↓
14. User FOUND in database (existing user)
    ↓
15. Backend generates JWT tokens (access + refresh)
    ↓
16. Backend sets cookies: accessToken, refreshToken (httpOnly)
    ↓
17. Backend redirects: ${FRONTEND_URL}/dashboard?auth=success
    ↓
18. Browser loads /dashboard
    ↓
19. Layout renders with <AuthProvider> wrapper
    ↓
20. AuthProvider calls initializeAuth() on mount
    ↓
21. initializeAuth() sees token in localStorage
    ↓
22. Calls fetchCurrentUser() to validate token
    ↓
23. Sets user, isAuthenticated = true
    ↓
24. Dashboard renders with user data
    ✅ SUCCESS: User is logged in
```

### For New User Signing Up

```
Steps 1-13 are same as above
    ↓
14. User NOT found in database (new user)
    ↓
15. Backend creates temporary JWT with email + googleId
    - Expires in 15 minutes
    - Stored in URL: ?token=...
    ↓
16. Backend redirects: ${FRONTEND_URL}/auth/complete-signup?token=...
    ↓
17. Browser loads /auth/complete-signup?token=...
    ↓
18. Frontend extracts token from URL: useSearchParams().get('token')
    ↓
19. Displays username choice form
    ↓
20. User enters username: "john_doe"
    ↓
21. User clicks "Complete Setup"
    ↓
22. Frontend validates username (lowercase, alphanumeric + underscore)
    ↓
23. Frontend calls: POST /api/v1/auth/google/complete-signup
    - Body: { username: "john_doe", token: "..." }
    ↓
24. Backend receives request
    ↓
25. Backend decodes temp JWT token
    ↓
26. Backend extracts email + googleId from token
    ↓
27. Backend checks if username is already taken
    ↓
28. Username NOT taken, proceeds
    ↓
29. Backend creates user in MongoDB:
    - username: "john_doe"
    - email: "user@gmail.com"
    - googleId: "..."
    - password: null (OAuth user, no password)
    ↓
30. Backend generates permanent JWT tokens
    ↓
31. Backend sets cookies: accessToken, refreshToken
    ↓
32. Backend returns: { user: {...}, accessToken: "...", status: 201 }
    ↓
33. Frontend receives response
    ↓
34. Frontend stores accessToken in localStorage
    ↓
35. Frontend sets isAuthenticated = true
    ↓
36. Frontend redirects to /dashboard
    ↓
37. Dashboard renders with new user data
    ✅ SUCCESS: New user account created and logged in
```

---

## 🔧 How to Use the Fixes

### 1. Copy Environment Files

```bash
# Backend
cd NOTES-FLOW/BACKEND
cp .env.example .env
# Edit .env with your values

# Frontend
cd NOTES-FLOW/FRONTEND
cp .env.example .env.local
# Edit .env.local if needed (mostly just uses defaults)
```

### 2. Start Servers

```bash
# Terminal 1 - Backend
cd NOTES-FLOW/BACKEND
npm run dev
# Shows: "server running at http://localhost:8080"

# Terminal 2 - Frontend
cd NOTES-FLOW/FRONTEND
npm run dev
# Shows: "Ready at http://localhost:3000"
```

### 3. Test It

```
Visit http://localhost:3000/auth/login
Click "Sign in with Google"
Should redirect to Google login
Sign in and see dashboard
✅ Working!
```

---

## 🚨 If It Still Doesn't Work

### Check 1: Environment Variables

```bash
# Backend
echo $FRONTEND_URL
echo $GOOGLE_CLIENT_ID

# Frontend
echo $NEXT_PUBLIC_API_URL
```

### Check 2: Server Status

```bash
# Backend running on 8080?
curl http://localhost:8080/

# Frontend running on 3000?
curl http://localhost:3000/
```

### Check 3: Google Credentials

```
1. Visit https://console.cloud.google.com/
2. Project: NotesFlow
3. APIs & Services → Credentials
4. OAuth 2.0 Client ID
5. Verify:
   - Client ID matches .env
   - Client Secret matches .env
   - Redirect URIs includes: http://localhost:8080/api/v1/auth/google/callback
```

### Check 4: Browser Console (F12)

```javascript
// Should show no errors
// Should see in Application → Cookies:
-accessToken -
  refreshToken -
  // Should see in Application → Local Storage:
  accessToken;
```

### Check 5: Look at Backend Logs

```
Watch the terminal where `npm run dev` is running
Should see request logs for:
GET /api/v1/auth/auth/google
GET /api/v1/auth/google/callback
```

---

## 📝 Summary

**Before:**

- ❌ Google login/signup were mock functions
- ❌ Frontend didn't call real OAuth endpoints
- ❌ Backend used hardcoded URLs
- ❌ No auth state persistence
- ❌ No error handling
- ❌ Parameter name inconsistencies

**After:**

- ✅ Google login/signup call real API
- ✅ Full OAuth flow implemented
- ✅ Env variables for flexibility
- ✅ Auth state persists across reloads
- ✅ Proper error handling with redirects
- ✅ Consistent parameters everywhere
- ✅ Automatic token refresh
- ✅ Complete documentation

**You can now:**

- ✅ Register with email/password
- ✅ Login with email/password
- ✅ Login with Google (existing account)
- ✅ Signup with Google (new account)
- ✅ Stay logged in after refresh
- ✅ Make API calls with auth
- ✅ Automatic token refresh
