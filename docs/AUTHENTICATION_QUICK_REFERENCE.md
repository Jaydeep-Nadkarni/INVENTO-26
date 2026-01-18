# Authentication System - Quick Reference Guide

## 🔑 Current Authentication Flow

```
1. USER VISITS REGISTRATION/LOGIN PAGE
   ↓
2. USER CLICKS "SIGN IN WITH GOOGLE"
   ↓
3. GOOGLE SIGN-IN POPUP APPEARS
   ↓
4. USER AUTHENTICATES WITH GOOGLE
   ↓
5. CLIENT RECEIVES GOOGLE ID TOKEN
   ↓
6. CLIENT SENDS ID TOKEN TO: POST /auth/google
   ↓
7. SERVER VERIFIES TOKEN WITH FIREBASE ADMIN SDK
   ↓
8. SERVER GENERATES JWT TOKEN (7-DAY EXPIRY)
   ↓
9. CLIENT STORES JWT IN LOCALSTORAGE
   ↓
10. CLIENT USES JWT FOR ALL API REQUESTS
    (Header: Authorization: Bearer <jwt_token>)
```

---

## 📋 What Was Removed

| Item | Before | After |
|------|--------|-------|
| **Registration** | Email + Password | Google OAuth only |
| **Login** | Password/OTP | Google OAuth only |
| **Password Reset** | Email OTP system | ❌ Not available (use Google recovery) |
| **Profile Photo** | User uploads + Face detection | Google profile photo |
| **Face Recognition** | face-api.js validation | ❌ Removed (no longer needed) |
| **Email Verification** | OTP codes | ❌ Removed (Google verifies) |
| **Session Management** | Custom session | JWT tokens only |

---

## 🔒 Key Files to Know

### Backend
- **Auth Controller:** `server/src/controllers/userController.js`
  - `googleAuth()` - OAuth token exchange
  - `completeOnboarding()` - User profile setup
  - `getProfile()` - Fetch user data

- **Auth Service:** `server/src/services/authService.js`
  - `verifyGoogleIdToken()` - Firebase verification

- **JWT Service:** `server/src/services/jwtService.js`
  - `generateToken()` - Create JWT tokens

### Frontend
- **Register Page:** `client/src/pages/Register.jsx`
  - Google Sign-In button
  - Image upload (no face detection)
  - Profile completion form

- **Login Page:** `client/src/pages/Login.jsx`
  - Google Sign-In integration

- **API Client:** `client/src/utils/apiClient.js`
  - Automatic JWT Bearer header injection
  - 401/403 error handling

---

## 🚀 Environment Variables Needed

### Server `.env`
```env
# Google OAuth (Firebase Admin)
FIREBASE_PROJECT_ID=xxxxx
FIREBASE_PRIVATE_KEY=xxxxx
FIREBASE_CLIENT_EMAIL=xxxxx

# JWT Signing
JWT_SECRET=your-secret-key-here-32-chars-min

# MongoDB
MONGO_URI=mongodb+srv://user:password@host/db

# Email (for VIP invites)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## ✅ API Endpoints (Google OAuth)

### Authentication
```javascript
// Sign in with Google
POST /auth/google
Body: { idToken: "google-oauth-token" }
Response: { 
  token: "jwt_token",
  user: { id, name, email, photoURL }
}
```

### Protected Endpoints (Require JWT)
```javascript
// Any endpoint that needs authentication
GET /api/user/profile
Headers: { "Authorization": "Bearer <jwt_token>" }
```

---

## 🧪 Testing the Flow

### In Browser Console:
```javascript
// 1. After Google Sign-In
const token = localStorage.getItem('authToken');
console.log('JWT Token:', token);

// 2. Verify token structure
const parts = token.split('.');
console.log('Header:', JSON.parse(atob(parts[0])));
console.log('Payload:', JSON.parse(atob(parts[1])));

// 3. Test API call
fetch('/api/user/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(d => console.log('Profile:', d));
```

### Using cURL:
```bash
# Test JWT token
curl -H "Authorization: Bearer <your_jwt_token>" \
  http://localhost:5000/api/user/profile
```

---

## 🐛 Common Issues & Fixes

### Issue: "Invalid Firebase Token"
**Cause:** Firebase Admin SDK not configured  
**Fix:** Verify `FIREBASE_PRIVATE_KEY` in `.env` has proper formatting (include `\n`)

### Issue: "JWT not in header"
**Cause:** API call not using `apiClient.js`  
**Fix:** Use `apiPost()` or `apiGet()` instead of direct `fetch()`

### Issue: "User not found"
**Cause:** First time sign-in, needs onboarding  
**Fix:** Complete user profile in onboarding form

### Issue: "Token expired"
**Cause:** JWT older than 7 days  
**Fix:** User needs to sign in again

### Issue: "Face detection not working" (old error)
**Cause:** That feature was removed  
**Fix:** Use Google profile photo instead

---

## 🔐 Security Best Practices

✅ **DO:**
- Use HTTPS in production
- Store JWT in secure httpOnly cookies (optional)
- Validate JWT on backend for all requests
- Refresh token periodically
- Use Firebase Admin SDK for verification
- Implement CORS properly

❌ **DON'T:**
- Store passwords (not your responsibility)
- Re-implement OAuth (use Firebase Admin SDK)
- Trust client-side validation
- Log JWT tokens
- Store tokens in sessionStorage (use localStorage)
- Extend JWT expiry beyond 7 days without refresh logic

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `server/README.md` | Complete API & deployment docs |
| `docs/AUTHENTICATION_CLEANUP_SUMMARY.md` | What was removed & why |
| `docs/AUTHENTICATION_CLEANUP_VERIFICATION.md` | Verification report |
| `docs/AUTHENTICATION_QUICK_REFERENCE.md` | This file |

---

## 🆘 Still Need Help?

### For Users:
1. Click "Sign in with Google"
2. Use your Google account email
3. Complete your profile
4. Done!

### For Developers:
1. Read `server/README.md`
2. Review `server/src/controllers/userController.js`
3. Check `client/src/utils/apiClient.js`
4. Test with provided cURL commands
5. Check browser DevTools Network tab for JWT headers

### For Deployment:
1. Set all environment variables
2. Test Google OAuth on staging
3. Verify email service works
4. Monitor error logs after deploy
5. Have rollback plan ready

---

## 📊 Migration Status

| Component | Status | Last Updated |
|-----------|--------|--------------|
| Google OAuth | ✅ Active | Jan 2025 |
| JWT Tokens | ✅ Active | Jan 2025 |
| Face-API | ❌ Removed | Jan 2025 |
| OTP System | ❌ Removed | Jan 2025 |
| Password Auth | ❌ Removed | Jan 2025 |
| Email Verification | ✅ Working (VIP only) | Jan 2025 |
| Profile Photos | ✅ From Google | Jan 2025 |

---

## 🎯 Key Takeaways

1. **Google OAuth is required** - It's the only auth method now
2. **JWT tokens last 7 days** - After that, user must sign in again
3. **No face detection** - Google photos are used instead
4. **Email service remains** - Only for VIP invitations now
5. **All API calls need JWT** - In Authorization header as Bearer token
6. **Graceful degradation** - ForgotPassword page explains the change
7. **Automatic legacy linking** - Old accounts linked by email automatically

---

**Last Updated:** January 2025  
**For Questions:** Review the detailed documentation files
