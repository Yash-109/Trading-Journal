# 🔐 Authentication API Documentation
## Trading Journal Pro+ - Password Security System

**Version**: 1.0.0  
**Base URL**: `http://localhost:5000/api/auth` (development)  
**Production URL**: `https://your-domain.com/api/auth`

---

## Table of Contents
1. [Authentication Overview](#authentication-overview)
2. [Endpoints](#endpoints)
3. [Error Codes](#error-codes)
4. [Examples](#examples)
5. [Security](#security)

---

## Authentication Overview

The authentication system uses:
- **JWT (JSON Web Tokens)** for session management
- **Bcrypt** for secure password storage
- **Password validation** with 8 requirements

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Endpoints

### 1. Register User
**Create a new user account with secure password validation**

#### Request
```http
POST /register
Content-Type: application/json

{
  "username": "trader123",
  "email": "user@example.com",
  "password": "Tr@ding2024Journal"
}
```

#### Response (201 - Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "trader123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response (400 - Validation Error)
```json
{
  "success": false,
  "message": "Password does not meet security requirements",
  "errors": [
    "Password must be at least 12 characters long",
    "Password must include at least 1 uppercase letter (A-Z)"
  ],
  "strength": "weak"
}
```

#### Response (400 - User Exists)
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

#### Validation Rules
| Rule | Example | Error Message |
|------|---------|---------------|
| Username required | | Username is required |
| Email required | | Email is required |
| Valid email format | invalid@email | Invalid email format |
| Password required | | Password is required |
| Min 12 characters | Pass123! | At least 12 characters |
| 1 uppercase | pass123!A | At least 1 uppercase |
| 1 lowercase | PASS123!a | At least 1 lowercase |
| 1 number | Pass!abc | At least 1 number |
| 1 special char | Pass123 | At least 1 special character |
| No username in pwd | trainer123!Pass | Cannot contain username |
| No email in pwd | user123!Pass | Cannot contain email |
| Not common | password123! | Too common password |

---

### 2. Login User
**Authenticate user and receive JWT token**

#### Request
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Tr@ding2024Journal"
}
```

#### Response (200 - Success)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "trader123"
    }
  }
}
```

#### Response (401 - Invalid Credentials)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### Response (400 - Missing Fields)
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

#### Notes
- Generic error message prevents user enumeration
- Password comparison uses constant-time algorithm
- Token expires after 7 days (configurable)

---

### 3. Change Password
**Update user password with validation**

#### Request
```http
POST /change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecure#2025",
  "newPasswordConfirm": "NewSecure#2025"
}
```

#### Response (200 - Success)
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "strength": "strong"
  }
}
```

#### Response (400 - Invalid Current Password)
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

#### Response (400 - New Passwords Don't Match)
```json
{
  "success": false,
  "message": "New passwords do not match"
}
```

#### Response (400 - Same as Old Password)
```json
{
  "success": false,
  "message": "New password cannot be the same as current password"
}
```

#### Response (400 - Validation Failed)
```json
{
  "success": false,
  "message": "Password does not meet security requirements",
  "errors": [
    "Password is too common"
  ]
}
```

#### Response (401 - Unauthorized)
```json
{
  "success": false,
  "message": "User not found"
}
```

#### Notes
- Requires valid JWT token
- New password must meet all security requirements
- Cannot reuse current password
- All validation same as registration

---

## Error Codes

### HTTP Status Codes
| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful operation |
| 201 | Created | User successfully registered |
| 400 | Bad Request | Validation failed, invalid data |
| 401 | Unauthorized | Invalid credentials or missing token |
| 404 | Not Found | User not found |
| 500 | Server Error | Backend error |

### Error Response Format
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["Specific error 1", "Specific error 2"],
  "strength": "weak"  // Only for password validation errors
}
```

---

## Examples

### Example 1: Successful Registration Flow
```javascript
// Frontend
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'trader123',
    email: 'trader@example.com',
    password: 'Tr@ding2024Journal'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.data.token);
  // Redirect to dashboard
}
```

### Example 2: API Call with Authentication
```javascript
// Protected endpoint call
const response = await fetch('/api/auth/change-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    currentPassword: 'OldPassword123!',
    newPassword: 'NewSecure#2025',
    newPasswordConfirm: 'NewSecure#2025'
  })
});
```

### Example 3: Error Handling
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'trader',
    email: 'trader@example.com',
    password: 'weak'  // Invalid password
  })
});

const data = await response.json();
if (!data.success) {
  console.log('Errors:', data.errors);
  // Display each error to user:
  // - Password must be at least 12 characters long
  // - Password must include at least 1 uppercase letter (A-Z)
  // etc.
}
```

### Example 4: Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "trader123",
    "email": "trader@example.com",
    "password": "Tr@ding2024Journal"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trader@example.com",
    "password": "Tr@ding2024Journal"
  }'

# Change Password
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "currentPassword": "Tr@ding2024Journal",
    "newPassword": "NewSecure#2025",
    "newPasswordConfirm": "NewSecure#2025"
  }'
```

### Example 5: Postman Collection
```json
{
  "info": {
    "name": "Trading Journal Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"username\":\"trader123\",\"email\":\"trader@example.com\",\"password\":\"Tr@ding2024Journal\"}"
        },
        "url": {"raw": "{{base_url}}/api/auth/register", "host": ["{{base_url}}"], "path": ["api", "auth", "register"]}
      }
    }
  ]
}
```

---

## Security

### Token Security
- Tokens are signed with `JWT_SECRET`
- Tokens expire after configured duration (default: 7 days)
- Always transmit over HTTPS in production
- Store tokens securely (httpOnly cookies recommended)

### Password Security
- Passwords are hashed with Bcrypt (12 rounds)
- Hashing takes ~150ms (by design for security)
- Passwords never stored in plain text
- Password comparison uses constant-time algorithms

### Best Practices
- Always validate on server (don't trust client validation)
- Use HTTPS for all authentication endpoints
- Implement rate limiting on auth endpoints
- Log failed authentication attempts
- Implement account lockout after failed attempts
- Never send passwords in URL parameters or logs

### Headers
```
Content-Type: application/json
Authorization: Bearer {token}
X-Request-ID: {unique-id}  (optional, for logging)
```

---

## Rate Limiting (Recommended)

Add to your server (example with express-rate-limit):
```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 requests per window
  message: 'Too many login attempts'
});

router.post('/login', authLimiter, loginUser);
router.post('/register', authLimiter, registerUser);
```

---

## Webhook Events (Optional)

Consider implementing webhooks for:
- User registration
- Failed login attempts
- Password changes
- Account lockouts

---

## Testing Checklist

- [ ] Register with valid password
- [ ] Register with invalid password
- [ ] Register with existing email
- [ ] Login with correct credentials
- [ ] Login with wrong password
- [ ] Change password successfully
- [ ] Change password with wrong current password
- [ ] Test all error scenarios
- [ ] Verify token expiration
- [ ] Test CORS headers
- [ ] Load testing for performance

---

## Support

For issues or questions:
1. Check [PASSWORD_SECURITY_GUIDE.md](PASSWORD_SECURITY_GUIDE.md)
2. Review [PASSWORD_QUICK_REFERENCE.md](PASSWORD_QUICK_REFERENCE.md)
3. Run [PASSWORD_VALIDATION_TESTS.js](PASSWORD_VALIDATION_TESTS.js)
4. Check inline code comments

---

**API Version**: 1.0.0  
**Last Updated**: March 18, 2026  
**Status**: Production Ready ✅
