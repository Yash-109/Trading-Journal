# Frontend-Backend Integration Guide

## Overview
The React frontend is now fully integrated with the backend API. All authentication and data operations are handled through secure API calls.

## Architecture

### API Service (`src/services/api.js`)
- **Base URL Configuration**: Uses `VITE_API_URL` environment variable
- **JWT Token Management**: Automatically attaches tokens to requests
- **401 Error Handling**: Redirects to login when authentication fails
- **Export Functions**:
  - `authAPI.register()` - User registration
  - `authAPI.login()` - User authentication
  - `tradesAPI.*` - Trade CRUD operations
  - `reflectionsAPI.*` - Reflection CRUD operations
  - `rulesAPI.*` - Rule CRUD operations

### Authentication Context (`src/context/AuthContext.jsx`)
- **State Management**:
  - `isAuthenticated` - Authentication status
  - `user` - Current user data
  - `isLoading` - Loading state
- **Functions**:
  - `login(email, password)` - Login user
  - `register(email, password)` - Register new user
  - `logout()` - Logout and clear session

### App Context (`src/context/AppContext.jsx`)
- **Data Management**:
  - Loads data from backend on authentication
  - All CRUD operations use real API calls
  - Settings stored in localStorage
- **Functions**:
  - Trade: `addTrade()`, `updateTrade()`, `deleteTrade()`
  - Reflection: `addReflection()`, `deleteReflection()`
  - Rule: `addRule()`, `updateRule()`, `deleteRule()`
  - Data: `exportData()`, `importData()`, `loadAllData()`

## Routes

### Public Routes
- `/login` - User login page
- `/register` - User registration page

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard
- `/journal` - Trade journal
- `/analytics` - Analytics and charts
- `/reflection` - Daily reflections
- `/rules` - Trading rules
- `/settings` - User settings

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, update the URL accordingly.

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# Update VITE_API_URL if needed
```

### 3. Start Backend Server
```bash
cd backend
npm start
# Backend should run on http://localhost:5000
```

### 4. Start Frontend Development Server
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

## Usage Flow

### First Time User
1. Navigate to http://localhost:5173
2. Redirected to `/login`
3. Click "Create one" to go to `/register`
4. Enter email and password
5. Submit registration
6. Redirected to `/login`
7. Login with credentials
8. Access protected routes

### Returning User
1. Navigate to http://localhost:5173
2. If token exists and valid → Dashboard
3. If token expired → Login page
4. Login with credentials
5. Access all features

## API Integration Details

### Authentication Flow
1. User submits login credentials
2. `authAPI.login()` sends POST to `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. All subsequent requests include token in `Authorization` header

### Protected API Requests
1. Check for token in localStorage
2. Attach token to request headers: `Authorization: Bearer <token>`
3. Backend middleware validates token
4. If valid → Process request
5. If invalid → Return 401
6. Frontend catches 401 → Clear token → Redirect to login

### Data Operations
- **Create**: POST to `/api/{resource}`
- **Read**: GET from `/api/{resource}`
- **Update**: PUT to `/api/{resource}/:id`
- **Delete**: DELETE from `/api/{resource}/:id`

## Error Handling

### API Errors
- All API errors are caught and displayed via toast notifications
- 401 errors trigger automatic logout and redirect to login
- Network errors show appropriate error messages

### Form Validation
- Login: Email and password required
- Register: Email validation, password minimum 6 characters, password confirmation match

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Protected Routes**: Unauthenticated users redirected to login
3. **Token Expiry**: Automatic logout on token expiration
4. **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

## Data Persistence

- **User Data**: Stored in MongoDB via backend
- **Authentication**: JWT tokens in localStorage
- **Settings**: Stored in localStorage (can be moved to backend later)

## Component Updates

### Navbar
- Added logout button
- Displays current user email
- Logout clears authentication and redirects to login

### Pages (Dashboard, Journal, Analytics, etc.)
- Now fetch real data from backend
- Display loading states while fetching
- Show empty states when no data

## Testing

### Manual Testing Checklist
- [ ] User can register a new account
- [ ] User can login with valid credentials
- [ ] Invalid credentials show error
- [ ] Protected routes redirect to login when not authenticated
- [ ] Trades can be created, updated, and deleted
- [ ] Reflections can be created and deleted
- [ ] Rules can be created, updated, and deleted
- [ ] Logout clears session and redirects to login
- [ ] Token expiry triggers automatic logout

## Troubleshooting

### "Network Error" or "Failed to fetch"
- Ensure backend server is running on http://localhost:5000
- Check CORS configuration in backend
- Verify VITE_API_URL in .env file

### "Unauthorized - Please login again"
- Token may have expired (default 7 days)
- Clear localStorage and login again
- Check JWT_SECRET in backend .env

### "Cannot read property of undefined"
- Ensure backend is returning data in expected format
- Check API response structure matches frontend expectations
- Verify MongoDB connection and data models

## Future Enhancements

1. **Refresh Tokens**: Implement token refresh mechanism
2. **Remember Me**: Optional persistent login
3. **Email Verification**: Verify email addresses
4. **Password Reset**: Forgot password functionality
5. **Social Auth**: Google, GitHub login
6. **Settings API**: Move settings to backend
7. **Real-time Updates**: WebSocket for live data sync
8. **Offline Support**: Service worker and IndexedDB

## Notes

- The frontend uses Vite, so environment variables must be prefixed with `VITE_`
- Token is automatically cleared on 401 errors
- All API calls go through the centralized `api.js` service
- Authentication state is managed globally via AuthContext
- App data is managed via AppContext with backend integration
