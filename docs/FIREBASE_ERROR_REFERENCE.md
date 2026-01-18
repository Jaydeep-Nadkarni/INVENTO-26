# 🔥 Firebase Error Reference & Solutions

Quick lookup for Firebase-related errors in INVENTO 2026.

---

## Error: `Firebase: Error (auth/invalid-api-key)`

### Cause
Firebase configuration is missing or incomplete in `client/.env`

### Solution
1. Open `client/.env`
2. Fill in all 6 Firebase values (see [FIREBASE_CONFIGURATION_FIX.md](../docs/FIREBASE_CONFIGURATION_FIX.md))
3. Restart dev server: `npm run dev`

### Example
```env
VITE_FIREBASE_API_KEY=AIzaSyC_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=invento-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=invento-2026
VITE_FIREBASE_STORAGE_BUCKET=invento-2026.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

---

## Error: `Firebase: Error (auth/operation-not-allowed)`

### Cause
Google Sign-In not enabled in Firebase project

### Solution
1. Go to Firebase Console > Authentication > Sign-in method
2. Click **Google** provider
3. Toggle **Enabled** to ON
4. Save changes
5. Restart dev server

---

## Error: `Popup blocked by browser`

### Cause
Browser blocking Google sign-in popup (usually in private/incognito mode)

### Solution
- Use normal (not private) browser window
- Check browser popup settings
- Ensure site is trusted

---

## Error: `Cannot read property 'getAuth' of undefined`

### Cause
Firebase wasn't imported or initialized properly

### Solution
Check `client/src/config/firebase.js`:
```javascript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ... other 5 values
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

---

## Error: `CORS error when sending token to server`

### Cause
Server CORS configuration doesn't allow frontend origin

### Solution
Update `server/.env`:
```env
# For local development:
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# For production:
ALLOWED_ORIGINS=https://yourdomain.com
```

Then restart server: `npm run dev` (in server/)

---

## Error: `Failed to fetch user profile after login`

### Cause
Either:
1. Server not running
2. Wrong API URL in `client/.env`
3. JWT token not sent with request

### Solution
1. **Check server running:**
   ```bash
   curl http://localhost:5000/api/users
   ```
   Should respond (not timeout)

2. **Check API URL:**
   ```env
   # client/.env should have:
   VITE_API_URL=http://localhost:5000
   ```

3. **Check JWT is sent:**
   - Open DevTools > Network tab
   - Click login and monitor requests
   - Check Authorization header in requests

---

## Error: `User not found after Google login`

### Cause
First-time user needs to complete onboarding form

### Solution
This is expected behavior:
1. Google login succeeds
2. User is redirected to registration/onboarding page
3. User fills in profile info
4. Account is created

No action needed - it's working correctly!

---

## Error: `Firebase app name ... already exists`

### Cause
Firebase initialized multiple times (usually due to hot reload)

### Solution
Usually self-resolves on reload. If persistent:
1. Stop dev server: `Ctrl+C`
2. Clear browser cache: `Ctrl+Shift+Del`
3. Restart dev server: `npm run dev`
4. Reload browser: `F5`

---

## Error: `Invalid JWT token from Firebase`

### Cause
Server can't verify Google token from Firebase

### Solution
Check `server/.env` Firebase configuration:
```env
# All 6 Firebase server credentials must match project:
FIREBASE_PROJECT_ID=invento-2026
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_CLIENT_ID=...
```

Restart server after updating.

---

## Error: `Rate limit exceeded (429)`

### Cause
Made too many login attempts (>5 per minute)

### Solution
Wait 1 minute and try again. This is a security feature.

Check server logs:
```
[RATE_LIMIT] Auth endpoint limit exceeded from IP 127.0.0.1
```

---

## Error: `Validation failed: phone number invalid`

### Cause
Entered invalid phone number in onboarding form

### Solution
Phone must be:
- 7-15 digits
- Valid international format
- No spaces or special characters

Example valid numbers:
- `9876543210`
- `+919876543210`
- `+1-800-555-0199` (will be processed as `18005550199`)

---

## Error: `Profile photo upload failed`

### Cause
- File too large (>5MB)
- Wrong format (must be JPG/PNG)
- Network timeout

### Solution
1. Reduce image size (< 1MB recommended)
2. Use JPG or PNG format
3. Check internet connection
4. Try again

---

## Error: `Email validation failed`

### Cause
Email entered in onboarding is invalid

### Solution
Email must:
- Be a valid email format
- Have @ symbol
- Have domain with dot

Example valid emails:
- `user@example.com`
- `john.doe@college.ac.in`

---

## 🔍 Debugging Tips

### Check environment variables loaded:
```javascript
// In browser console:
console.log(import.meta.env)
```

Should show all `VITE_*` variables with actual values (not "your-api-key-here")

### Enable detailed Firebase logging:
```javascript
// Add to src/config/firebase.js before initializeApp():
import { initializeApp } from "firebase/app";

// Enable Firebase debug logging
if (import.meta.env.VITE_APP_ENV === 'development') {
  import { enableLogging } from "firebase/app";
  enableLogging(true);
}
```

### Monitor API requests:
1. Open DevTools (F12)
2. Go to Network tab
3. Click login button
4. Watch requests to `/api/users/auth/google`
5. Check response status and error messages

### Check server logs:
```bash
# Terminal running server should show:
# ✅ [STARTUP] Environment Configuration
# ✅ [AUTH] TOKEN_VERIFICATION_SUCCESS ...
# ❌ [AUTH_FAIL] ...error message...
```

---

## 📞 Still Need Help?

1. **Read:** [docs/FIREBASE_CONFIGURATION_FIX.md](../docs/FIREBASE_CONFIGURATION_FIX.md)
2. **Check:** All environment variables are set
3. **Verify:** Both client and server are running
4. **Review:** Browser console for error details
5. **Monitor:** Server terminal for auth event logs

---

**Last Updated:** January 18, 2026
