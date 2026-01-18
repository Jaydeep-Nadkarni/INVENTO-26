# 🔥 Firebase Error - COMPLETE FIX GUIDE

## THE ERROR
```
Firebase: Error (auth/invalid-api-key)
```

## THE REASON
You're missing Firebase credentials in `client/.env`

## THE FIX (3 steps, 3 minutes)

### 1️⃣ Go Get Credentials
```
https://console.firebase.google.com
→ Select INVENTO project
→ ⚙️ Settings > General
→ Copy Web app config (6 values)
```

### 2️⃣ Update client/.env
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=invento-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=invento-2026
VITE_FIREBASE_STORAGE_BUCKET=invento-2026.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef...
```

### 3️⃣ Restart
```
Ctrl+C  →  npm run dev
```

## VERIFY
Open http://localhost:5173/login
- See "Sign in with Google" button? ✅ Done!
- Error still there? → Read below

---

## HELP! Still Broken?

### Check 1: File saved?
```
cat client/.env | grep VITE_FIREBASE_API_KEY
Should show: VITE_FIREBASE_API_KEY=AIzaSy...
```

### Check 2: Server restarted?
```
Did you see "Local: http://localhost" message?
If not: Ctrl+C and npm run dev again
```

### Check 3: Cache cleared?
```
Ctrl+Shift+Del → Cached images → Delete
Then reload browser (F5)
```

### Check 4: Got right values?
```
Are they from Firebase Console?
Not "your-api-key-here"?
Not blank?
Not from old screenshot?
```

### Still stuck?
→ [FIX_FIREBASE_ERROR_NOW.md](FIX_FIREBASE_ERROR_NOW.md) (detailed help)

---

## WHAT NOW?

**Works?** Click "Sign in with Google" on login page! 🎉

**Still errors?** Read troubleshooting above.

**Want to learn more?** See [FIREBASE_DOCUMENTATION_INDEX.md](FIREBASE_DOCUMENTATION_INDEX.md)

---

## QUICK REFERENCE

| What | Where | Time |
|------|-------|------|
| Ultra quick fix | This file | 2 mins |
| 3-step guide | [FIX_FIREBASE_ERROR_NOW.md](FIX_FIREBASE_ERROR_NOW.md) | 3 mins |
| Complete guide | [docs/FIREBASE_CONFIGURATION_FIX.md](docs/FIREBASE_CONFIGURATION_FIX.md) | 10 mins |
| Error solutions | [docs/FIREBASE_ERROR_REFERENCE.md](docs/FIREBASE_ERROR_REFERENCE.md) | 5 mins |
| Diagrams | [docs/FIREBASE_VISUAL_GUIDE.md](docs/FIREBASE_VISUAL_GUIDE.md) | 15 mins |
| Full map | [FIREBASE_DOCUMENTATION_INDEX.md](FIREBASE_DOCUMENTATION_INDEX.md) | 3 mins |

---

**That's it!** Go fix your Firebase error now. 🚀
