# 🔥 Firebase Error - FIX IN 3 STEPS

**Error:** `Firebase: Error (auth/invalid-api-key)`

---

## STEP 1️⃣ : Get Firebase Credentials (2 minutes)

### Go to Firebase Console
```
https://console.firebase.google.com
```

### Navigate to Your Project
```
1. Click "INVENTO 2026" (or your project name)
2. Click ⚙️ icon (Project Settings) - top left
3. Click "General" tab
4. Scroll down to "Your apps" section
5. Find the Web app (</> icon)
6. Copy the entire config object
```

### Copy This From Firebase Console

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

---

## STEP 2️⃣ : Update client/.env (1 minute)

### Open This File
```
d:\Programming\Project KLE\INVENTO-2026\client\.env
```

### Fill In These 6 Values

```env
VITE_FIREBASE_API_KEY=AIzaSyC_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=invento-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=invento-2026
VITE_FIREBASE_STORAGE_BUCKET=invento-2026.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### Keep These As-Is
```env
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000
VITE_ENV=development
VITE_APP_ENV=development
```

### Save File
```
Ctrl + S
```

---

## STEP 3️⃣ : Restart Dev Server (30 seconds)

### In Client Terminal
```bash
# Stop the server
Ctrl + C

# Start again
npm run dev
```

### Wait for This Message
```
  VITE v5.x.x  build 0000ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Test It Works
```
Open browser: http://localhost:5173/login
Look for: "Sign in with Google" button
Check console: No error messages
```

---

## ✅ You're Done!

If you see:
- ✅ Login page loads
- ✅ "Sign in with Google" button visible
- ✅ No error messages
- ✅ Browser console is clean

**Then Firebase is working!** 🎉

---

## ❌ Still Seeing Error?

### Check 1: Did you save `.env`?
```bash
# Verify file has values
cat client/.env | grep VITE_FIREBASE_API_KEY
# Should show: VITE_FIREBASE_API_KEY=AIzaSy...
# NOT blank or "your-api-key-here"
```

### Check 2: Did you restart server?
```bash
# In client terminal
Ctrl + C  (completely stop)
npm run dev  (wait for "Local: http://localhost" message)
```

### Check 3: Did you clear cache?
```bash
# In browser
Ctrl + Shift + Del
Check: Cached images and files
Click: Delete data
```

### Check 4: Is server running?
```bash
# In a new terminal, in server/ folder
npm run dev
# Should see: [STARTUP] Environment Configuration
```

---

## 📚 Need More Help?

If you're still stuck, see:

1. **Quick Start:** [FIREBASE_QUICK_START.md](FIREBASE_QUICK_START.md)
2. **Full Guide:** [docs/FIREBASE_CONFIGURATION_FIX.md](docs/FIREBASE_CONFIGURATION_FIX.md)
3. **Visual Guide:** [docs/FIREBASE_VISUAL_GUIDE.md](docs/FIREBASE_VISUAL_GUIDE.md)
4. **Error Reference:** [docs/FIREBASE_ERROR_REFERENCE.md](docs/FIREBASE_ERROR_REFERENCE.md)

---

## 🎯 What Happens Next

After Firebase is fixed:

```
1. User clicks "Sign in with Google"
2. Google login dialog appears
3. User signs in
4. Redirected to onboarding form
5. Complete profile
6. Account created and logged in ✅
```

All security features are already enabled:
- Rate limiting ✅
- Input validation ✅
- CORS protection ✅
- Security headers ✅
- Auth logging ✅

---

**That's it! Simple 3-step fix.** 🚀

**Total time:** ~3 minutes  
**Difficulty:** Very easy  
**Status:** Ready to go!
