# Xano Stream Token Generation Setup

This guide shows you how to set up Stream user token generation in Xano using your Stream credentials.

## Your Stream Credentials

**⚠️ IMPORTANT: Keep these secure!**

- **API Key**: `cahz5hr5r6pt` (used in mobile app)
- **API Secret**: `scj6n6h399xsb5b9pwq5xsetfzvndq24zv2npbr9znmxgeky5f22cajzh44ma4vy` (BACKEND ONLY)

The API Secret should **NEVER** be exposed in the mobile app. It must only be used on your Xano backend.

## Setup Steps

### 1. Store API Secret in Xano Environment Variables

1. Go to your Xano workspace
2. Click on **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `STREAM_API_SECRET`
   - **Value**: `scj6n6h399xsb5b9pwq5xsetfzvndq24zv2npbr9znmxgeky5f22cajzh44ma4vy`
   - **Type**: Text (keep it private)

### 2. Install JWT Add-on in Xano

Stream tokens are JWT (JSON Web Tokens). You need to enable JWT functionality:

1. Go to **Add-ons** in Xano
2. Search for "JWT" or "JSON Web Token"
3. Install the JWT add-on if available

**OR** use Xano's built-in `encode_jwt()` function if available.

### 3. Create Stream Chat Token Endpoint

Create a new API endpoint: `POST /stream/chat-token`

#### Input Schema
```json
{
  "user_id": "number"
}
```

#### Function Stack

**Step 1: Prepare Token Data**
```javascript
// Get user_id from input
var userId = input.user_id;

// Create Stream user ID
var streamUserId = "user_" + userId;

// Get current timestamp
var now = Math.floor(Date.now() / 1000);

// Token expires in 24 hours
var exp = now + (24 * 60 * 60);
```

**Step 2: Create JWT Payload**
```javascript
var payload = {
  "user_id": streamUserId,
  "iat": now,
  "exp": exp
};
```

**Step 3: Generate Token**
```javascript
// Using Xano's JWT function or add-on
var token = encode_jwt(
  payload,
  env.STREAM_API_SECRET,
  "HS256"
);
```

**Step 4: Return Token**
```javascript
return {
  "token": token,
  "user_id": streamUserId,
  "expires_at": exp
};
```

#### Complete Xano Function (JavaScript-like pseudocode)

```javascript
function generateChatToken(input) {
  // Step 1: Prepare data
  const userId = input.user_id;
  const streamUserId = `user_${userId}`;
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (24 * 60 * 60); // 24 hours

  // Step 2: Create payload
  const payload = {
    user_id: streamUserId,
    iat: now,
    exp: exp
  };

  // Step 3: Generate JWT token
  const token = encode_jwt(
    payload,
    env.STREAM_API_SECRET,
    'HS256'
  );

  // Step 4: Return
  return {
    token: token,
    user_id: streamUserId,
    expires_at: exp
  };
}
```

### 4. Create Stream Video Token Endpoint

Create a new API endpoint: `POST /stream/video-token`

This is **identical** to the chat token endpoint. Stream uses the same token format for both chat and video.

You can either:
- Duplicate the chat token endpoint, OR
- Create a unified `/stream/token` endpoint

### 5. Test the Endpoints

#### Test Chat Token

**Request:**
```bash
POST /stream/chat-token
{
  "user_id": 123
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "user_123",
  "expires_at": 1699999999
}
```

#### Test Video Token

**Request:**
```bash
POST /stream/video-token
{
  "user_id": 123
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "user_123",
  "expires_at": 1699999999
}
```

## Alternative: Using External Request

If Xano doesn't have built-in JWT support, you can use a serverless function or call an external service.

### Option 1: Use a Node.js Serverless Function

Deploy this to Vercel, Netlify, or similar:

```javascript
const jwt = require('jsonwebtoken');

export default function handler(req, res) {
  const { user_id } = req.body;
  const streamUserId = `user_${user_id}`;

  const token = jwt.sign(
    { user_id: streamUserId },
    'scj6n6h399xsb5b9pwq5xsetfzvndq24zv2npbr9znmxgeky5f22cajzh44ma4vy',
    { algorithm: 'HS256', expiresIn: '24h' }
  );

  res.json({ token, user_id: streamUserId });
}
```

Then call this from Xano using an **External API Request**.

### Option 2: Manual JWT Generation in Xano

If you can't use JWT add-on, here's the manual approach:

```javascript
// Base64url encode function
function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Create header
const header = base64url(JSON.stringify({
  alg: 'HS256',
  typ: 'JWT'
}));

// Create payload
const payload = base64url(JSON.stringify({
  user_id: streamUserId,
  iat: now,
  exp: exp
}));

// Create signature using HMAC SHA256
const signature = hmac_sha256(
  `${header}.${payload}`,
  env.STREAM_API_SECRET
);

// Combine parts
const token = `${header}.${payload}.${signature}`;
```

## Verify Token Generation

Use Stream's API to verify your tokens are correct:

```bash
curl -X GET "https://chat.stream-io-api.com/users/user_123" \
  -H "Authorization: Bearer YOUR_GENERATED_TOKEN" \
  -H "Stream-Auth-Type: jwt"
```

If the token is valid, you'll get a successful response. If invalid, you'll get a 401 error.

## Security Best Practices

1. **Never expose the API Secret**
   - Don't commit it to Git
   - Don't expose it in API responses
   - Store it only in Xano environment variables

2. **Set appropriate expiration times**
   - 24 hours is a good default
   - Shorter for high-security needs
   - Implement token refresh if needed

3. **Validate user identity**
   - Ensure the requesting user is authenticated
   - Only generate tokens for valid, logged-in users
   - Check user permissions before generating tokens

4. **Add authentication to endpoints**
   - Protect `/stream/chat-token` with Xano authentication
   - Require a valid user session
   - Return 401 if not authenticated

## Example: Protected Endpoint

Add authentication to your token endpoint:

```javascript
// Check if user is authenticated
if (!auth_user) {
  return {
    error: "Unauthorized",
    status: 401
  };
}

// Verify user_id matches authenticated user
if (input.user_id !== auth_user.id) {
  return {
    error: "Forbidden",
    status: 403
  };
}

// Generate token for authenticated user only
// ... rest of token generation code
```

## Troubleshooting

### Token is invalid
- Check that API Secret matches exactly (no extra spaces)
- Verify JWT algorithm is HS256
- Ensure payload structure is correct
- Check expiration time is in the future

### App shows "Authentication failed"
- Verify Xano endpoints are returning tokens correctly
- Check network connectivity from app
- Look for errors in app console logs
- Verify Stream API key in app matches dashboard

### Tokens expire too quickly
- Increase expiration time in token generation
- Implement token refresh mechanism
- Store expiration time and refresh before it expires

## Next Steps

1. ✅ Set up environment variable in Xano
2. ✅ Create `/stream/chat-token` endpoint
3. ✅ Create `/stream/video-token` endpoint
4. ✅ Test token generation
5. ✅ Add authentication to endpoints
6. ✅ Test from mobile app
7. ✅ Remove development token fallbacks from app

## Support

If you run into issues:
- Check Xano documentation for JWT functions
- Review Stream's token documentation: https://getstream.io/chat/docs/javascript/tokens_and_authentication/
- Test tokens using Stream's API directly

---

**Your Stream API Key**: `cahz5hr5r6pt`
**Your Stream API Secret**: `scj6n6h399xsb5b9pwq5xsetfzvndq24zv2npbr9znmxgeky5f22cajzh44ma4vy` (Backend only!)
