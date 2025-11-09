# Authentication System Documentation

## Overview

This expense tracker app uses a secure JWT-based authentication system with Django backend integration. The implementation follows security best practices including encrypted token storage, automatic token refresh, and proper session management.

## Architecture

### Components

1. **Token Manager** (`app/services/tokenManager.ts`)
   - Secure token storage using expo-secure-store
   - Token expiration tracking
   - Validation helpers

2. **API Client** (`app/services/api.ts`)
   - Axios-based HTTP client
   - Automatic Bearer token injection
   - 401 error handling with token refresh
   - Request/response interceptors

3. **Auth Service** (`app/services/authService.ts`)
   - Login, logout, register functions
   - Password reset functionality
   - Current user profile fetching
   - Error handling and formatting

4. **Auth Store** (`app/store/authStore.ts`)
   - Zustand global state management
   - User state and authentication status
   - Login/logout actions

5. **Auth Context** (`app/context/AuthContext.tsx`)
   - App-level authentication initialization
   - Loading state during auth check

6. **Custom Hooks** (`app/hooks/useAuth.ts`)
   - Convenient access to auth state
   - Type-safe authentication actions

## Security Features

### ✅ Token Security
- **Encrypted Storage**: Tokens stored using `expo-secure-store` (platform-specific encryption)
- **Short-Lived Access Tokens**: 10-minute expiration for access tokens
- **Automatic Refresh**: Tokens refresh automatically before expiration
- **Secure Transmission**: HTTPS-only API calls
- **No URL/Query Params**: Tokens never exposed in URLs

### ✅ Token Refresh Flow
1. Access token stored with 10-minute expiration
2. API client checks for 401 responses
3. On 401, automatically attempts token refresh
4. Refresh request queued if already refreshing
5. On success, retry failed request with new token
6. On failure, clear all tokens and redirect to login

### ✅ Session Management
- Auth state checked on app startup
- User redirected based on authentication status
- Tokens validated before allowing access
- Logout clears all tokens and resets state

## Django Backend Requirements

### Expected Endpoints

```python
# Login
POST /api/v1/auth/login/
Request: { "email": "user@example.com", "password": "password" }
Response: { "access": "token", "refresh": "token", "user": {...} }

# Token Refresh
POST /api/v1/auth/token/refresh/
Request: { "refresh": "refresh_token" }
Response: { "access": "new_access_token" }

# Logout
POST /api/v1/auth/logout/
Headers: { "Authorization": "Bearer access_token" }
Request: { "refresh": "refresh_token" }
Response: { "message": "Successfully logged out" }

# Get Current User
GET /api/v1/auth/me/
Headers: { "Authorization": "Bearer access_token" }
Response: { "id": "1", "email": "user@example.com", ... }

# Register
POST /api/v1/auth/register/
Request: { "email": "...", "password": "...", "first_name": "...", "last_name": "..." }
Response: { "access": "token", "refresh": "token", "user": {...} }

# Password Reset Request
POST /api/v1/auth/password-reset/
Request: { "email": "user@example.com" }

# Password Reset Confirm
POST /api/v1/auth/password-reset/confirm/
Request: { "token": "reset_token", "password": "new_password" }
```

### Django Settings

```python
# settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=10),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

## Configuration

### API Base URL

Update the API URL in `app/services/api.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:8000/api' // Development (local Django server)
  : 'https://your-production-api.com/api'; // Production
```

For iOS simulator, use `http://localhost:8000`
For Android emulator, use `http://10.0.2.2:8000`
For physical devices, use your computer's IP address

## Usage

### Login

```typescript
import { useAuth } from './hooks/useAuth';

function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigate to dashboard on success
    } catch (error) {
      // Handle error
    }
  };
}
```

### Logout

```typescript
import { useAuth } from './hooks/useAuth';

function Dashboard() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigate to login
  };
}
```

### Protected Routes

```typescript
import { useAuth } from './hooks/useAuth';
import { Redirect } from 'expo-router';

function ProtectedScreen() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <YourScreen />;
}
```

### Making Authenticated API Calls

```typescript
import apiClient from './services/api';

// Token automatically injected via interceptor
const response = await apiClient.get('/expenses/');
const expenses = response.data;
```

## Error Handling

### Django Error Response Format

```json
{
  "email": ["This field is required."],
  "password": ["This field is required."],
  "non_field_errors": ["Invalid credentials."]
}
```

### Handling in Components

```typescript
try {
  await login(email, password);
} catch (error: any) {
  if (error.data?.email) {
    setEmailError(error.data.email[0]);
  }
  if (error.data?.password) {
    setPasswordError(error.data.password[0]);
  }
  if (error.data?.non_field_errors) {
    setGeneralError(error.data.non_field_errors[0]);
  }
}
```

## Testing

### Test Login Flow

1. Start your Django backend
2. Start Expo: `npm start`
3. Open app on iOS/Android
4. Try logging in with valid credentials
5. Verify redirect to dashboard
6. Test logout functionality

### Test Token Refresh

1. Login successfully
2. Wait 9+ minutes (or modify expiration time for testing)
3. Make an API call
4. Verify automatic token refresh
5. Check that request succeeds

### Test Error Handling

1. Try login with invalid credentials
2. Verify error messages display correctly
3. Try with missing fields
4. Verify field-specific validation

## Troubleshooting

### Common Issues

**"Network Error" or "Connection Refused"**
- Ensure Django backend is running
- Check API_BASE_URL is correct for your platform
- For iOS simulator: use `localhost`
- For Android emulator: use `10.0.2.2`

**"Unauthorized" on every request**
- Check Django JWT settings
- Verify token is being sent in headers
- Check token expiration settings

**Token refresh fails**
- Verify `/api/token/refresh/` endpoint exists
- Check refresh token is valid
- Ensure Django JWT is configured correctly

## File Structure

```
app/
├── services/
│   ├── api.ts              # HTTP client with interceptors
│   ├── authService.ts      # Authentication logic
│   └── tokenManager.ts     # Secure token storage
├── store/
│   └── authStore.ts        # Global auth state (Zustand)
├── context/
│   └── AuthContext.tsx     # Auth initialization provider
├── hooks/
│   └── useAuth.ts          # Convenient auth hook
├── types/
│   └── auth.ts             # TypeScript types
├── login.tsx               # Login screen
├── dashboard.tsx           # Protected dashboard
└── _layout.tsx             # Root layout with AuthProvider
```

## Next Steps

1. **Set up Django backend** with JWT authentication
2. **Test authentication flow** end-to-end
3. **Add user profile features** (edit profile, change password)
4. **Implement refresh token rotation** for enhanced security
5. **Add biometric authentication** (Face ID, Touch ID)
6. **Implement remember me** functionality
7. **Add social auth providers** (Google, Apple)

## Dependencies

- `expo-secure-store` - Encrypted token storage
- `zustand` - Lightweight state management
- `axios` - HTTP client with interceptors
- `expo-router` - File-based routing

## Resources

- [Django REST Framework JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
