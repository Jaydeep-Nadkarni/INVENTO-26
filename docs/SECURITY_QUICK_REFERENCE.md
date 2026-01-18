# 🔒 Security Quick Reference

**Purpose:** Quick lookup for security features and configuration

---

## 📋 Rate Limiting

### Configuration
```javascript
// Auth endpoints: 5 requests/minute/IP
POST /api/users/auth/google
POST /api/users/auth/onboarding

// General API: 100 requests/15 minutes/IP
GET /api/*
POST /api/*
```

### Testing
```bash
# Test rate limit (replace with your IP)
for i in {1..6}; do curl -X POST http://localhost:5000/api/users/auth/google -d '{"idToken":"test"}'; done
# 6th request should return 429
```

### Response When Limited
```json
{
  "success": false,
  "message": "Too many authentication attempts. Please try again in a minute.",
  "retryAfter": <timestamp>
}
```

---

## 🛡️ CORS Setup

### In `.env`
```env
# Development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Production
ALLOWED_ORIGINS=https://app.invento2026.com,https://staging.invento2026.com
```

### Test CORS
```bash
# Allowed origin
curl -H "Origin: http://localhost:3000" \
  -X GET http://localhost:5000/api/user/profile

# Disallowed origin - should fail
curl -H "Origin: http://evil.com" \
  -X GET http://localhost:5000/api/user/profile
```

---

## 🔐 Input Validation

### Available Validators

```javascript
import {
  validateAndSanitizeEmail,
  validatePhoneNumber,
  validateUserName,
  validateGender,
  validateCollegeName,
  validateFirebaseUid,
  validateIdTokenFormat,
  validateOnboardingData,
  sanitizeOnboardingData
} from '../utils/securityUtils.js';
```

### Usage Example
```javascript
// Validate data
const validation = validateOnboardingData(req.body);
if (!validation.isValid) {
  return res.status(400).json({ errors: validation.errors });
}

// Sanitize data
const sanitized = sanitizeOnboardingData(req.body);
```

### Validation Rules

| Field | Rules |
|-------|-------|
| **Email** | Valid email format |
| **Phone** | 7-15 digits, international format |
| **Name** | 2-100 chars, letters/spaces/hyphens |
| **College** | 3-200 chars, alphanumeric + common chars |
| **Gender** | Male, Female, Other, Prefer not to say |
| **Firebase UID** | 28 alphanumeric characters |
| **Token** | JWT format (3 parts separated by dots) |

---

## 📊 Environment Variables

### Required
```env
MONGO_URI=<database-connection>
JWT_SECRET=<min-32-characters>
FIREBASE_PROJECT_ID=<project-id>
FIREBASE_PRIVATE_KEY_ID=<key-id>
FIREBASE_PRIVATE_KEY=<pem-key>
FIREBASE_CLIENT_EMAIL=<email>
FIREBASE_CLIENT_ID=<id>
EMAIL_USER=<email>
EMAIL_PASSWORD=<password>
PORT=5000
```

### Optional (with defaults)
```env
NODE_ENV=development              # development|staging|production
LOG_LEVEL=info                   # error|warn|info|debug
JWT_EXPIRY=7d                    # Token expiry
ALLOWED_ORIGINS=localhost:3000   # Comma-separated URLs
```

### Validate on Startup
Server validates all env vars and logs:
```
[STARTUP] Environment Configuration
============================================================
  NODE_ENV: production
  PORT: 5000
  JWT_SECRET_LENGTH: 64
  FIREBASE_PROJECT_ID: my-project
  ALLOWED_ORIGINS: https://app.invento2026.com
============================================================
```

---

## 📝 Logging Events

### Success Events
```
[AUTH] 2026-01-18T10:30:45.123Z - TOKEN_VERIFICATION_SUCCESS from 192.168.1.1 (user@email.com)
[AUTH] 2026-01-18T10:30:46.456Z - GOOGLE_AUTH_SUCCESS from 192.168.1.1 (user@email.com)
[AUTH] 2026-01-18T10:30:47.789Z - ONBOARDING_SUCCESS from 192.168.1.1 (user@email.com)
```

### Failure Events
```
[AUTH_FAIL] 2026-01-18T10:30:48.000Z - TOKEN_EXPIRED from 192.168.1.1: The session has expired
[AUTH_FAIL] 2026-01-18T10:30:49.000Z - GOOGLE_AUTH_FAILED from 192.168.1.2: Verification failed
[AUTH_FAIL] 2026-01-18T10:30:50.000Z - ONBOARDING_VALIDATION_FAILED from 192.168.1.3: Invalid phone
```

---

## 🔧 Common Tasks

### Update CORS Origins
1. Edit `.env`
2. Update `ALLOWED_ORIGINS`
3. Restart server
```bash
ALLOWED_ORIGINS=https://newdomain.com,https://anotherdomain.com
```

### Generate New JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: abc123def456...
# Copy output to JWT_SECRET in .env
```

### Check if Env Variables are Valid
```bash
node -e "require('dotenv').config(); require('./src/utils/envValidator').validateEnvironmentVariables(); console.log('✓ All valid')"
```

### Monitor Auth Logs
```bash
# All auth events
tail -f logs/auth.log | grep AUTH

# Only failures
tail -f logs/auth.log | grep AUTH_FAIL

# Specific event type
tail -f logs/auth.log | grep TOKEN_VERIFICATION_SUCCESS
```

---

## 🚀 Deployment Checklist

```
[ ] .env file created with all required variables
[ ] JWT_SECRET is 32+ characters
[ ] ALLOWED_ORIGINS updated with production domains
[ ] NODE_ENV set to 'production'
[ ] HTTPS/SSL certificate installed
[ ] All environment variables validated
[ ] Rate limiting tested
[ ] CORS tested with production domain
[ ] Input validation tested
[ ] Logging configured
[ ] Error messages reviewed (no sensitive info)
[ ] .env file permissions set to 600 (chmod 600 .env)
```

---

## 🧪 Security Test Commands

### Test Authentication Rate Limit
```bash
# Should succeed (1-5 requests)
curl -X POST http://localhost:5000/api/users/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken":"test-token"}'

# Should fail with 429 (6th request)
curl -X POST http://localhost:5000/api/users/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken":"test-token"}'
```

### Test Input Validation
```bash
# Invalid phone number
curl -X POST http://localhost:5000/api/users/auth/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid":"12345678901234567890123456",
    "name":"John Doe",
    "phone":"invalid-phone",
    "clgName":"College",
    "gender":"Male"
  }'

# Response includes: "Invalid phone number format"
```

### Test CORS
```bash
# Allowed origin
curl -H "Origin: http://localhost:3000" \
  -X OPTIONS http://localhost:5000/api/events

# Disallowed origin
curl -H "Origin: http://hacker.com" \
  -X OPTIONS http://localhost:5000/api/events
```

### Test Helmet Headers
```bash
# Check security headers
curl -i http://localhost:5000/ | grep -E "Strict-Transport|X-Frame|Content-Security"

# Should see:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Frame-Options: DENY
# Content-Security-Policy: ...
```

---

## 🎯 Quick Security Checklist

### Before Each Deployment
- [ ] `JWT_SECRET` is strong (32+ chars)
- [ ] `ALLOWED_ORIGINS` matches environment
- [ ] All required env vars are set
- [ ] `NODE_ENV` matches deployment environment
- [ ] HTTPS enabled (production)
- [ ] Logs are being collected

### Weekly Monitoring
- [ ] Review authentication logs
- [ ] Check for rate limit violations
- [ ] Monitor for unusual patterns
- [ ] Verify error logging is working

### Monthly Maintenance
- [ ] Run `npm audit` for vulnerabilities
- [ ] Update security packages
- [ ] Review CORS allowed origins
- [ ] Verify backup of .env file

### Quarterly Review
- [ ] Security audit of code
- [ ] Penetration testing (if possible)
- [ ] Review all logged auth failures
- [ ] Update security policies

---

## 📚 References

- **Detailed Setup:** See `SECURITY_IMPLEMENTATION.md`
- **Environment Config:** See `.env.example`
- **Full Implementation:** See `server/src/utils/securityUtils.js`
- **Authorization Logs:** Server console or log file

---

**Last Updated:** January 18, 2026  
**Version:** 1.0.0
