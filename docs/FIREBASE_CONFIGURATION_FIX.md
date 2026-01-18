# 🔥 Firebase Configuration Error - Complete Fix Guide

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Date:** January 18, 2026

---

## ✅ Quick Fix (2 minutes)

### Step 1: Create `.env` in client folder

```bash
cd client
cp .env.example .env
```

### Step 2: Get Firebase Credentials

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your **INVENTO 2026** project
3. Click **⚙️ Project Settings** (gear icon, top-left)
4. Go to **General** tab
5. Scroll down to **"Your apps"** section
6. Find your **Web** app (should show as a `</>` icon)
7. Copy the config object

### Step 3: Fill in `.env`

Your Firebase console should show something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "invento-2026.firebaseapp.com",
  projectId: "invento-2026",
  storageBucket: "invento-2026.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Paste into `client/.env`:**

```env
VITE_FIREBASE_API_KEY=AIzaSyC_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=invento-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=invento-2026
VITE_FIREBASE_STORAGE_BUCKET=invento-2026.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_API_URL=http://localhost:5000
```

### Step 4: Restart Dev Server

```bash
# Kill current dev server (Ctrl+C)
npm run dev
```

---

## 🔍 Why This Error Happens

```
CLIENT APPLICATION
    │
    ├─ Load Firebase config from .env
    │   ├─ VITE_FIREBASE_API_KEY = (empty) ✗
    │   ├─ VITE_FIREBASE_AUTH_DOMAIN = (empty) ✗
    │   └─ VITE_FIREBASE_PROJECT_ID = (empty) ✗
    │
    ├─ Initialize Firebase with empty config
    │   └─ Firebase rejects invalid/empty API key
    │
    └─ Error: auth/invalid-api-key ✗
```

---

## 📋 Complete Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Open Firebase Console
- [ ] Navigate to Project Settings > General
- [ ] Copy all 6 Firebase config values
- [ ] Paste into `client/.env`
- [ ] Restart dev server with `npm run dev`
- [ ] Test login page (should load without errors)

---

## 🧪 Verify It Works

### Browser Console Check
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. You should **NOT** see `auth/invalid-api-key` error
4. Test by clicking **Sign in with Google** button

### Network Check
```bash
# In another terminal, verify server is running:
curl http://localhost:5000/api/users
```

Should get a response (not a connection error).

---

## 📁 File Structure (After Setup)

```
client/
├── .env                      ← CREATE THIS (add your Firebase credentials)
├── .env.example              ← Already created (copy from this)
├── .gitignore                ← Should include .env (don't commit secrets!)
├── src/
│   └── config/
│       └── firebase.js       ← Reads from .env variables
└── ...
```

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Missing `.env` file
```
Error: VITE_FIREBASE_API_KEY is undefined
Solution: Create client/.env with all 6 values
```

### ❌ Mistake 2: Wrong variable names
```
WRONG: FIREBASE_API_KEY=...
RIGHT: VITE_FIREBASE_API_KEY=...
Reason: Vite only exposes env vars that start with VITE_
```

### ❌ Mistake 3: Quotes included
```
WRONG: VITE_FIREBASE_API_KEY="AIzaSy..."
RIGHT: VITE_FIREBASE_API_KEY=AIzaSy...
Reason: .env files don't need quotes
```

### ❌ Mistake 4: Server not running
```
Error: Cannot POST /api/users/auth/google
Solution: Start server in separate terminal
# Terminal 1: npm run dev (in client/)
# Terminal 2: npm run dev (in server/)
```

### ❌ Mistake 5: Stale dev server
```
Error: Still getting auth/invalid-api-key after updating .env
Solution: Kill and restart dev server (Ctrl+C, then npm run dev)
```

---

## 🔐 Security Notes

**IMPORTANT:** Your `.env` file contains sensitive information:
- Never commit `.env` to Git
- Never share with others
- Only use development/test API keys in `.env`
- Keep production keys in secure secret manager

**Check `.gitignore`:**
```bash
cat .gitignore | grep -E "\.env|env\.local"
```

Should include:
```
.env
.env.local
.env.*.local
```

---

## 📞 Troubleshooting Steps

### If error persists after updating .env:

**1. Check file was saved**
```bash
cat client/.env | grep VITE_FIREBASE_API_KEY
```
Should show your actual API key (not "your-api-key-here")

**2. Restart dev server completely**
```bash
# In client terminal:
# 1. Press Ctrl+C to stop
# 2. npm run dev
# 3. Wait for "VITE v..." to appear
# 4. Reload browser (F5)
```

**3. Clear browser cache**
```bash
# In DevTools:
# 1. Right-click refresh button
# 2. Select "Empty cache and hard refresh"
# OR
# 1. Press Ctrl+Shift+Del
# 2. Delete "Cached images and files"
```

**4. Check Firebase project exists**
```bash
# Verify at Firebase Console:
# 1. Project should be named "invento-2026" (or similar)
# 2. Web app should exist (show </> icon)
# 3. Google Sign-In should be enabled
#    (Authentication > Sign-in method > Google > Enabled)
```

**5. Test API connectivity**
```bash
# Server running on 5000?
curl -v http://localhost:5000/

# Should respond with something (not timeout)
```

---

## ✨ What Happens After Fix

```
CLIENT (.env configured)
    │
    ├─ Load Firebase config
    │   ├─ VITE_FIREBASE_API_KEY = "AIzaSy..." ✓
    │   ├─ VITE_FIREBASE_AUTH_DOMAIN = "project.firebaseapp.com" ✓
    │   └─ ... other 4 values ✓
    │
    ├─ Initialize Firebase
    │   └─ Firebase validates API key ✓
    │
    ├─ Enable Google Sign-In
    │   └─ "Sign in with Google" button appears ✓
    │
    └─ Ready to authenticate ✓
        └─ Click button → Google login → Token → Server ✓
```

---

## 📚 Related Files

These files work together:

1. **[client/.env](client/.env)** - Environment variables (you create this)
2. **[client/src/config/firebase.js](client/src/config/firebase.js)** - Reads .env and initializes Firebase
3. **[client/src/pages/Login.jsx](client/src/pages/Login.jsx)** - Sign in with Google button
4. **[client/src/pages/Register.jsx](client/src/pages/Register.jsx)** - Onboarding after Google login
5. **[server/.env](server/.env)** - Server-side Firebase credentials (different from client!)

---

## 🆘 Still Having Issues?

Check these in order:

1. ✅ Does `client/.env` exist?
   ```bash
   ls -la client/.env
   ```

2. ✅ Does it have 6 Firebase values (not "your-api-key-here")?
   ```bash
   grep VITE_FIREBASE client/.env
   ```

3. ✅ Are they valid (start with correct patterns)?
   - `VITE_FIREBASE_API_KEY` should start with `AIzaSy...`
   - `VITE_FIREBASE_AUTH_DOMAIN` should end with `.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID` should be lowercase with hyphens

4. ✅ Did you restart dev server after editing?
   - Kill: `Ctrl+C`
   - Restart: `npm run dev`

5. ✅ Is server running?
   ```bash
   # In another terminal in server/ folder:
   npm run dev
   ```

---

**You're all set! Firebase error should be gone.** 🎉

Next: Test Google sign-in on the login page.
