# 🚀 Firebase Setup Checklist

**Error Fixed:** `Firebase: Error (auth/invalid-api-key)`

---

## ✅ What To Do Now

### 1. Get Firebase Credentials (2 mins)

- [ ] Open [Firebase Console](https://console.firebase.google.com)
- [ ] Select your INVENTO project
- [ ] Click ⚙️ **Project Settings**
- [ ] Go to **General** tab
- [ ] Scroll to **"Your apps"** section
- [ ] Copy the **Web app** config

### 2. Fill in `client/.env` (1 min)

File location: `client/.env`

```env
# Paste your 6 Firebase values here:
VITE_FIREBASE_API_KEY=AIzaSy...          ← From Firebase Console
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...

# Already configured:
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Restart Dev Server (30 secs)

```bash
# In client/ terminal:
Ctrl + C                    # Stop current server
npm run dev                 # Start again
```

### 4. Test Login Page

- [ ] Open http://localhost:5173
- [ ] Navigate to **Login** page
- [ ] Should see "Sign in with Google" button
- [ ] No console errors about `auth/invalid-api-key`

---

## 🎯 Expected Result

✅ Login page loads without Firebase errors  
✅ "Sign in with Google" button is clickable  
✅ No red errors in browser console  

---

## 📖 Full Guide

See: [docs/FIREBASE_CONFIGURATION_FIX.md](../docs/FIREBASE_CONFIGURATION_FIX.md)

Contains:
- Step-by-step screenshots (text version)
- Troubleshooting guide
- Common mistakes and fixes
- Security notes

---

## 🆘 If Still Stuck

1. **Error still appears after restart?**
   - Delete `node_modules` and reinstall
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

2. **Can't find Firebase Console?**
   - Direct link: https://console.firebase.google.com/u/0/
   - Select your project from the list

3. **Missing "Web app" in Firebase?**
   - Go to Project Settings > General
   - Click "Add app" > Web app
   - Follow setup wizard

4. **Still blank values in .env?**
   - Double-check you copied from the right place
   - Firebase Console > Project Settings > **General** (not Service Accounts)

---

**Status:** Ready to test once `.env` is filled in! 🎉
