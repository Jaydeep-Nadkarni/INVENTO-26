# INVENTO Backend Server

## Overview
This is the backend API server for the INVENTO application, built with Node.js, Express, and MongoDB. The server handles user authentication, event management, volunteer coordination, and notification systems.

## Authentication System (Migrated)

### Google OAuth 2.0 (Current - Active)
The system now uses **Google Sign-In** for all user authentication:
- OAuth 2.0 tokens from Google are exchanged for JWT tokens on the backend
- JWT tokens (7-day expiry) are used for all API requests
- Profile data (name, email, photo) comes directly from Google accounts
- No password management required

#### How It Works:
1. Client: User clicks "Sign in with Google"
2. Google returns an OAuth ID token
3. Client sends OAuth token to `/auth/google` endpoint
4. Server verifies token with Firebase Admin SDK
5. Server issues JWT token valid for 7 days
6. Client uses JWT token for all subsequent API calls

**API Endpoint:**
```
POST /auth/google
Headers: { "Authorization": "Bearer <google_oauth_token>" }
Response: { token: "jwt_token", user: { id, name, email, photoURL } }
```

### Legacy Authentication (Deprecated - Removed)

The following authentication methods have been **removed** and are no longer functional:

#### ❌ Password-Based Registration
- `POST /auth/register` - Removed
- Local password storage functionality removed
- Use Google Sign-In instead

#### ❌ OTP (One-Time Password) System  
- `POST /auth/sendLoginOTP` - Removed
- `POST /auth/verifyLoginOTP` - Removed
- `POST /auth/verifyOTP` - Removed
- Email-based OTP verification removed
- Use Google Sign-In instead

#### ❌ Password Reset via Email
- `POST /auth/requestPasswordReset` - Removed
- `POST /auth/resetPassword` - Removed
- Password recovery flow removed
- Use Google account recovery instead

**Why Removed:**
- Google OAuth provides superior security
- Eliminates password management burden
- Single sign-on is more user-friendly
- Facial recognition (face-api.js) no longer needed since Google provides profile photos

---

## Migration Guide for Users with Legacy Accounts

### For Users with Old Password Accounts

If you previously registered with an email and password:

1. **Go to Login Page** → Click "Don't have an account? Sign up"
2. **Sign in with Google** using the same email address
3. **Complete Onboarding** with your Google profile information
4. **Your old account data will be preserved** during the migration

### For Users with OTP Accounts

If you previously used OTP (email code) to log in:

1. **Go to Login Page**
2. **Sign in with Google** using the same email address  
3. **Complete Onboarding**
4. **No password required** - Google handles authentication

### Troubleshooting

**"Can't find my account"**
- Ensure you're using the same email address you registered with
- Google Sign-In requires a valid Google account
- If you don't have a Google account, create one at [google.com](https://google.com)

**"My data is missing"**
- Account data is automatically linked during Google sign-in
- If data still appears missing, contact support

---

## API Authentication

### JWT Token Usage

All authenticated API endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

#### Example Request:
```javascript
fetch('/api/user/profile', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
    'Content-Type': 'application/json'
  }
})
```

### Token Expiration & Refresh

- **Expiry:** 7 days from issuance
- **Refresh:** Users must re-authenticate (sign in again) after token expires
- **Automatic Handling:** Client automatically redirects to login on 401/403 errors

---

## Core Endpoints

### Authentication
- `POST /auth/google` - Google OAuth sign-in
- `POST /auth/complete-onboarding` - Complete user profile after sign-in

### User Management  
- `GET /api/user/profile` - Get current user profile
- `POST /api/user/invite-vip` - Send VIP invitations (email-based)
- `GET /api/user/validate` - Validate user session

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create new event (admin only)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Volunteers
- `GET /api/volunteers` - List all volunteers
- `POST /api/volunteers` - Register as volunteer
- `GET /api/volunteers/:id` - Get volunteer profile
- `PUT /api/volunteers/:id` - Update volunteer profile

### Notices
- `GET /api/notices` - List all notices
- `POST /api/notices` - Create notice (admin only)
- `DELETE /api/notices/:id` - Delete notice (admin only)

---

## Email System

### Active Features
- **VIP Invitations:** Send special invites to exclusive participants
- Subject: "You're invited to INVENTO 2026"
- Contains event details and registration link

### Removed Features
- ❌ OTP verification emails
- ❌ Password reset emails
- ❌ Account confirmation emails

### Nodemailer Configuration
Email transporter configured in environment variables. Credentials needed in `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## Environment Variables

Required `.env` file in root:

```
# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-secret-key

# Firebase (for Google OAuth verification)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server
PORT=5000
NODE_ENV=development
```

---

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
node server.js
```

Server runs on `http://localhost:5000`

---

## Database Models

### User Model
```
{
  firebaseId: String (unique),
  email: String (unique),
  name: String,
  photoURL: String,
  phone: String,
  college: String,
  branch: String,
  year: String,
  role: String (user/admin/volunteer),
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model
```
{
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  registeredUsers: [userId],
  createdBy: userId,
  status: String (scheduled/ongoing/completed/cancelled)
}
```

### Volunteer Model
```
{
  userId: ObjectId,
  eventId: ObjectId,
  status: String (registered/active/completed),
  hours: Number,
  joinDate: Date
}
```

---

## Security Features

✅ **Google OAuth:** Industry-standard authentication  
✅ **JWT Tokens:** Stateless, cryptographically signed  
✅ **CORS:** Restricted to approved origins  
✅ **Bcryptjs:** Password hashing (legacy, no longer used)  
✅ **Multer:** Secure file upload handling  
✅ **Environment Variables:** Sensitive data not in code  

---

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase Admin credentials valid
- [ ] MongoDB connection tested
- [ ] Email service credentials verified
- [ ] CORS origins configured correctly
- [ ] JWT secret is strong (32+ characters)
- [ ] Node version compatible (v16+)
- [ ] Database backups scheduled

---

## Support & Troubleshooting

### Common Issues

**"Invalid Firebase credential"**
- Verify Firebase Admin SDK credentials in `.env`
- Ensure JSON formatting is correct in PRIVATE_KEY

**"Token expired"**
- This is expected after 7 days
- User should sign in again to get new token

**"CORS error"**
- Check that client domain is in CORS whitelist
- Verify environment is production/development as expected

**"Email not sending"**
- Verify EMAIL_USER and EMAIL_PASSWORD in `.env`
- For Gmail, use [App Passwords](https://myaccount.google.com/apppasswords)
- Check email service logs

---

## Development Notes

### Recent Changes (Migration to Google OAuth)
- Removed local password authentication (Jan 2025)
- Removed OTP system (Jan 2025)
- Removed face-api.js integration (Jan 2025)
- Implemented Firebase Admin SDK for Google OAuth verification
- Implemented JWT token generation and validation

### Frontend Status
- ✅ Google Sign-In integrated
- ✅ JWT token stored in localStorage
- ✅ All API calls updated with Bearer token
- ✅ ForgotPassword page shows deprecation message
- ✅ Face detection removed from registration

---

## Version History

- **v1.0.0** (Current) - Google OAuth + JWT authentication
- **v0.9.0** - Legacy password + OTP system (deprecated)

---

## License

ISC License

---

**Last Updated:** January 2025  
**Next Review:** April 2025
