# Security Implementation Guide

**Date:** January 18, 2026  
**Status:** ✅ Complete  
**Version:** 1.0.0

---

## Overview

Comprehensive security measures have been implemented across the INVENTO server to protect against common attacks and vulnerabilities. This document outlines all security enhancements, their configurations, and best practices.

---

## 🔒 Security Measures Implemented

### 1. Rate Limiting

**Purpose:** Prevent brute-force attacks and DoS attempts

**Configuration:**

#### Authentication Endpoints (Strict)
- **Endpoints:** `/api/users/auth/google`, `/api/users/auth/onboarding`
- **Limit:** 5 requests per minute per IP address
- **Response:** 429 Too Many Requests
- **Message:** "Too many authentication attempts. Please try again in a minute."

#### General API (Standard)
- **Limit:** 100 requests per 15 minutes per IP address
- **Skipped endpoints:** Health check endpoint (`/`)

**Implementation:**
```javascript
// Authentication limiter (strict)
const authLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute window
  max: 5,                     // 5 requests
  message: 'Too many authentication attempts...',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.get('x-forwarded-for')
});

// General limiter (standard)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minute window
  max: 100                    // 100 requests
});
```

**Configuration in server.js:**
```javascript
app.use(generalLimiter);                    // Applied globally
app.use("/api/users/auth", authLimiter);   // Applied to auth routes
```

---

### 2. Helmet Security Headers

**Purpose:** Protect against XSS, clickjacking, and other header-based attacks

**Headers Configured:**

| Header | Purpose | Configuration |
|--------|---------|----------------|
| **Content-Security-Policy** | Prevent XSS attacks | Restrict scripts to same-origin |
| **Strict-Transport-Security** | Force HTTPS | maxAge: 1 year, preload |
| **X-Frame-Options** | Prevent clickjacking | DENY (no iframe embedding) |
| **Referrer-Policy** | Control referrer info | strict-origin-when-cross-origin |
| **X-Content-Type-Options** | Prevent MIME sniffing | nosniff |

**Implementation:**
```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,        // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
```

---

### 3. CORS Configuration

**Purpose:** Restrict API access to authorized frontend applications

**Current Configuration:**

```javascript
// Define allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
}));
```

**Environment Variable:**
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
```

**Production Recommendation:**
Replace `ALLOWED_ORIGINS` with your actual frontend domains:
```env
ALLOWED_ORIGINS=https://app.invento2026.com,https://staging.invento2026.com
```

---

### 4. Input Validation & Sanitization

**Purpose:** Prevent injection attacks and data corruption

**Location:** `server/src/utils/securityUtils.js`

**Functions Available:**

#### String Operations
- `sanitizeString(input)` - Remove harmful characters
- `validateAndSanitizeEmail(email)` - Validate and normalize email
- `sanitizeName(name)` - Remove special characters from names
- `sanitizePhoneNumber(phone)` - Remove formatting characters

#### Field Validators
- `validatePhoneNumber(phone)` - Check phone format
- `validateGender(gender)` - Validate against allowed values
- `validateCollegeName(name)` - Check college name format
- `validateUserName(name)` - Validate user name format
- `validateFirebaseUid(uid)` - Check Firebase UID format
- `validateIdTokenFormat(token)` - Validate JWT token structure

#### Comprehensive Validation
- `validateOnboardingData(data)` - Complete onboarding validation
- `sanitizeOnboardingData(data)` - Sanitize all onboarding fields

**Usage Example:**
```javascript
import {
  validateOnboardingData,
  sanitizeOnboardingData
} from '../utils/securityUtils.js';

// Validate input
const validation = validateOnboardingData(req.body);
if (!validation.isValid) {
  return res.status(400).json({ errors: validation.errors });
}

// Sanitize input
const sanitized = sanitizeOnboardingData(req.body);
user.name = sanitized.name;
```

---

### 5. Authentication Logging

**Purpose:** Track and audit authentication attempts for security monitoring

**Location:** `server/src/services/authService.js`

**Logging Function:**
```javascript
logAuthAttempt({
  eventType: 'TOKEN_VERIFICATION_SUCCESS',
  userId: uid,
  ip: clientIp,
  email: email,
  status: 'success',
  message: 'Google token verified successfully'
});
```

**Log Levels:**

| Log Level | When Logged | Example |
|-----------|------------|---------|
| **SUCCESS** | Valid authentication | Token verified, onboarding completed |
| **WARNING** | Non-critical failures | Photo processing failed |
| **FAILURE** | Security events | Invalid token, rate limit exceeded |

**Log Output Format:**
```
[AUTH] 2026-01-18T10:30:45.123Z - TOKEN_VERIFICATION_SUCCESS from 192.168.1.1 (user@email.com)
[AUTH_FAIL] 2026-01-18T10:30:46.456Z - TOKEN_EXPIRED from 192.168.1.2: The session has expired
```

**Logged Events:**
- `TOKEN_VERIFICATION_SUCCESS` - Token verified successfully
- `TOKEN_VERIFICATION_FAILED` - Token verification failed
- `TOKEN_VERIFICATION_TIMEOUT` - Verification timed out
- `TOKEN_FORMAT_INVALID` - Invalid token format
- `TOKEN_EXPIRED` - Token expired
- `TOKEN_REVOKED` - Token revoked
- `TOKEN_MALFORMED` - Malformed token
- `GOOGLE_AUTH_SUCCESS` - Google authentication successful
- `GOOGLE_AUTH_FAILED` - Google authentication failed
- `ONBOARDING_SUCCESS` - Onboarding completed
- `ONBOARDING_VALIDATION_FAILED` - Input validation failed
- `ONBOARDING_USER_NOT_FOUND` - User not found
- `ONBOARDING_ALREADY_COMPLETED` - Already onboarded

---

### 6. Environment Variable Validation

**Purpose:** Ensure all required configuration is present before server starts

**Location:** `server/src/utils/envValidator.js`

**Required Variables:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY_ID` - Firebase key ID
- `FIREBASE_PRIVATE_KEY` - Firebase private key (PEM format)
- `FIREBASE_CLIENT_EMAIL` - Firebase client email
- `FIREBASE_CLIENT_ID` - Firebase client ID
- `EMAIL_USER` - Email service username
- `EMAIL_PASSWORD` - Email service password
- `PORT` - Server port

**Optional Variables (with defaults):**
- `NODE_ENV` - Environment (default: development)
- `LOG_LEVEL` - Logging level (default: info)
- `JWT_EXPIRY` - Token expiry (default: 7d)
- `ALLOWED_ORIGINS` - CORS origins (default: localhost ports)

**Validation Checks:**
- ✅ All required variables present
- ✅ `JWT_SECRET` is at least 32 characters
- ✅ `PORT` is valid (1-65535)
- ✅ `NODE_ENV` is valid (development/staging/production)
- ✅ Firebase private key has valid PEM format
- ✅ Email format is valid
- ✅ `ALLOWED_ORIGINS` contains valid URLs

**Startup Output:**
```
============================================================
[STARTUP] Environment Configuration
============================================================
  NODE_ENV: production
  PORT: 5000
  JWT_EXPIRY: 7d
  LOG_LEVEL: info
  MONGO_URI: mongodb+srv://user***password@cluster.mongodb.net/db
  JWT_SECRET_LENGTH: 64
  FIREBASE_PROJECT_ID: my-project
  EMAIL_USER: noreply@invento.com
  ALLOWED_ORIGINS: http://localhost:3000,https://app.invento2026.com
============================================================
```

---

## 🛡️ Security Best Practices

### 1. API Request Handling

**All authentication requests should:**
- ✅ Use HTTPS in production
- ✅ Include `Content-Type: application/json` header
- ✅ Send `Authorization: Bearer <token>` for protected routes
- ✅ Expect rate limiting (5 requests/minute for auth)

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/users/auth/google \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <optional_jwt>" \
  -d '{"idToken":"<google_oauth_token>"}'
```

### 2. Error Handling

**Avoid exposing:**
- ❌ Stack traces in production
- ❌ Database error details
- ❌ Internal file paths
- ❌ Sensitive configuration

**Always return:**
- ✅ User-friendly error messages
- ✅ Appropriate HTTP status codes
- ✅ Generic error details

### 3. Data Protection

**For user data:**
- ✅ Sanitize all inputs
- ✅ Validate all inputs
- ✅ Store passwords/tokens securely
- ✅ Use HTTPS for transmission
- ✅ Use JWT with expiration

### 4. Rate Limiting Bypass Prevention

**Rate limiting applies to:**
- ✅ IP addresses (not user accounts)
- ✅ All authentication endpoints
- ✅ Distributed requests equally

**To bypass rate limits (development only):**
```bash
# Skip rate limiting for localhost
# Modify keyGenerator in server.js to allow local development
```

### 5. CORS Security

**Current allowed origins (development):**
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`

**Update for production:**
```env
ALLOWED_ORIGINS=https://app.invento2026.com,https://staging.invento2026.com
```

---

## 📊 Monitoring & Auditing

### View Authentication Logs

**Monitor in real-time:**
```bash
# Watch logs for authentication attempts
tail -f logs/auth.log | grep AUTH

# Watch for failures
tail -f logs/auth.log | grep AUTH_FAIL

# Watch for rate limiting
tail -f logs/auth.log | grep RATE_LIMIT
```

### Common Patterns to Monitor

| Pattern | Concern | Action |
|---------|---------|--------|
| Multiple `TOKEN_INVALID` from same IP | Possible attack | Increase rate limit window |
| Multiple `ONBOARDING_VALIDATION_FAILED` | Malformed requests | Check client implementation |
| Single IP hitting rate limit frequently | Suspicious activity | Block IP or investigate |

---

## 🧪 Testing Security

### 1. Test Rate Limiting

```bash
# Test auth endpoint rate limiting (should succeed)
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/users/auth/google \
    -H "Content-Type: application/json" \
    -d '{"idToken":"test"}'
done

# Test beyond limit (should get 429)
curl -X POST http://localhost:5000/api/users/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken":"test"}'
```

### 2. Test CORS

```bash
# Test with allowed origin (should succeed)
curl -X GET http://localhost:5000/api/user/profile \
  -H "Origin: http://localhost:3000"

# Test with disallowed origin (should fail)
curl -X GET http://localhost:5000/api/user/profile \
  -H "Origin: http://evil.com"
```

### 3. Test Input Validation

```bash
# Test with invalid email
curl -X POST http://localhost:5000/api/users/auth/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid":"12345678901234567890123456789012",
    "name":"John Doe",
    "phone":"invalid",
    "clgName":"Test College",
    "gender":"Male"
  }'

# Should return validation errors
```

---

## 📝 Configuration Checklist

### Pre-Production Deployment

- [ ] Update `ALLOWED_ORIGINS` with production frontend URLs
- [ ] Ensure `JWT_SECRET` is strong (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Verify all environment variables are set
- [ ] Test CORS with production domains
- [ ] Review rate limiting settings for your traffic
- [ ] Enable HTTPS/SSL certificate
- [ ] Set up log aggregation (Sentry, LogRocket, etc.)
- [ ] Monitor authentication logs regularly
- [ ] Have incident response plan ready

### Ongoing Security

- [ ] Review authentication logs weekly
- [ ] Monitor for unusual rate limit hits
- [ ] Update dependencies regularly
- [ ] Run security audits quarterly
- [ ] Review and update CORS allowed origins as needed
- [ ] Monitor for security advisories
- [ ] Test security measures monthly

---

## 🚨 Security Incident Response

### If Rate Limit Is Hit Frequently

1. Check logs for attack patterns
2. Identify affected IP address
3. Temporarily block IP via firewall (if possible)
4. Increase rate limit window if legitimate users
5. Investigate client implementation

### If Token Verification Fails

1. Check token expiration
2. Verify Firebase configuration
3. Check network connectivity to Firebase
4. Review error logs for details
5. Contact Firebase support if persistent

### If Suspicious Activity Detected

1. Review authentication logs
2. Identify pattern and source
3. Document incident
4. Notify security team
5. Implement additional monitoring
6. Consider blocking source IP

---

## 📚 References

- [Helmet Security Headers](https://helmetjs.github.io/)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP Security Guidelines](https://owasp.org/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/security)

---

**Last Updated:** January 18, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
