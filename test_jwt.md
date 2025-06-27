# JWT Authentication Test Guide

## 🔧 Debug JWT Issues

### 1. Clear Browser Storage
```javascript
// Open browser console and run:
localStorage.clear()
sessionStorage.clear()
```

### 2. Test Login API
```bash
# Test login with curl
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "hoainam001",
    "password": "123456"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 18,
    "username": "hoainam001",
    "firstName": "Le",
    "lastName": "Hoai Nam",
    "role": "DOCTOR"
  }
}
```

### 3. Test Protected API
```bash
# Test with valid token
curl -X GET http://localhost:8080/doctor/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Check Token in Browser
```javascript
// Check stored token
console.log("Token:", localStorage.getItem("token"))
console.log("User:", localStorage.getItem("user"))
```

### 5. Common Issues & Solutions

#### Issue: MalformedJwtException
**Cause:** Empty or invalid token being sent
**Solution:** 
- Clear localStorage
- Re-login
- Check token format

#### Issue: Token not stored
**Cause:** Login response format mismatch
**Solution:**
- Check backend returns `{token, user}` format
- Verify frontend extracts token correctly

#### Issue: Token expired
**Cause:** JWT expiration time too short
**Solution:**
- Check JwtService.EXPIRATION_TIME
- Re-login to get new token

### 6. Backend JWT Configuration

#### application.properties
```properties
jwtSecretString=your-secret-key-here-make-it-long-and-secure
```

#### JWT Expiration
```java
// In JwtService.java
private static final long EXPIRATION_TIME = 86400000; // 24 hours
```

### 7. Frontend Token Handling

#### API Interceptor
```javascript
// Only send token if valid
if (token && token.trim() !== "" && token !== "null") {
  config.headers["Authorization"] = `Bearer ${token}`
}
```

#### AuthContext
```javascript
// Validate token before storing
if (apiToken && apiToken.trim() !== "") {
  localStorage.setItem("token", apiToken)
}
```

### 8. Test Steps

1. **Clear storage:** `localStorage.clear()`
2. **Login:** Use test account `hoainam001` / `123456`
3. **Check token:** Verify token is stored correctly
4. **Test API:** Try accessing protected endpoint
5. **Check logs:** Look for JWT errors in backend console

### 9. Expected Flow

1. User enters credentials
2. Frontend sends POST to `/user/login`
3. Backend validates credentials
4. Backend generates JWT token
5. Backend returns `{token, user}`
6. Frontend stores token in localStorage
7. Frontend adds `Authorization: Bearer <token>` to requests
8. Backend validates token in JwtAuthenticationFilter

### 10. Troubleshooting Commands

```bash
# Check if backend is running
curl http://localhost:8080/actuator/health

# Test login endpoint
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"hoainam001","password":"123456"}'

# Check database connection
mysql -u root -p medisched -e "SELECT * FROM users WHERE username='hoainam001'"
``` 