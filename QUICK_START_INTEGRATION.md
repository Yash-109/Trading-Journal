# Quick Start: Frontend-Backend Integration

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend
```bash
cd backend
npm install  # if not already done
npm start
```
✅ Backend should be running on http://localhost:5000

### Step 2: Configure Frontend
```bash
cd frontend
npm install  # if not already done

# Create .env file (if not exists)
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Step 3: Start Frontend
```bash
npm run dev
```
✅ Frontend should be running on http://localhost:5173

## 🔐 Test the Integration

### Create a Test Account
1. Open http://localhost:5173
2. You'll be redirected to `/login`
3. Click **"Create one"** to register
4. Fill in:
   - Email: `test@example.com`
   - Password: `password123`
5. Click **"Create Account"**

### Login
1. You'll be redirected to `/login`
2. Enter your credentials
3. Click **"Sign In"**
4. You should be redirected to the Dashboard

### Test Features
✅ **Dashboard**: View stats and recent trades
✅ **Journal**: Add, edit, delete trades
✅ **Analytics**: View performance charts
✅ **Reflection**: Add daily reflections
✅ **Rules**: Create and manage trading rules
✅ **Settings**: Update preferences

## 🧪 Quick API Tests

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login (get token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Protected Routes
```bash
# Get trades (replace YOUR_TOKEN with actual token from login)
curl http://localhost:5000/api/trades \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ⚡ Key Files Created

```
frontend/
├── src/
│   ├── services/
│   │   └── api.js                    # API service with JWT handling
│   ├── context/
│   │   ├── AuthContext.jsx           # Authentication state
│   │   └── AppContext.jsx            # Updated with API calls
│   ├── pages/
│   │   ├── Login.jsx                 # Login page
│   │   └── Register.jsx              # Registration page
│   └── App.jsx                       # Updated with auth routes
├── .env                              # Environment config
└── .env.example                      # Environment template
```

## 🔑 Environment Variables

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env)** - Should already exist
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
```

## 🐛 Troubleshooting

### "Network Error"
- ✅ Check if backend is running on port 5000
- ✅ Verify `VITE_API_URL` in frontend/.env

### "Unauthorized"
- ✅ Token may have expired (login again)
- ✅ Clear browser localStorage and login again

### "Cannot connect to MongoDB"
- ✅ Check MongoDB is running
- ✅ Verify `MONGO_URI` in backend/.env

### CORS Errors
- ✅ Backend should already have CORS enabled
- ✅ Check backend/src/server.js for CORS config

## 📚 What Changed?

### Before Integration
- ❌ No authentication
- ❌ Data stored in browser memory only
- ❌ No persistence across sessions
- ❌ No user accounts

### After Integration
- ✅ JWT authentication
- ✅ Data persisted in MongoDB
- ✅ User-specific data
- ✅ Secure API calls
- ✅ Token-based sessions

## 🎯 Common Tasks

### Add New API Endpoint

1. **Backend**: Create route and controller
2. **Frontend**: Add to `src/services/api.js`:
```javascript
export const myAPI = {
  myMethod: async () => {
    const data = await apiRequest('/my-endpoint');
    return data;
  },
};
```
3. **Use in component**:
```javascript
import { myAPI } from '../services/api';
const data = await myAPI.myMethod();
```

### Protect New Route

In `App.jsx`:
```javascript
<Route
  path="/new-route"
  element={
    <ProtectedRoute>
      <NewComponent />
    </ProtectedRoute>
  }
/>
```

## 📖 Full Documentation

- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Integration Summary**: `INTEGRATION_SUMMARY.md`
- **Project README**: `README.md`

## ✅ Everything Working?

Test this checklist:
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can add a trade
- [ ] Can create a reflection
- [ ] Can add a rule
- [ ] Can logout
- [ ] Login redirects work

**All checked?** 🎉 Integration successful!

## 🆘 Need Help?

1. Check the browser console for errors
2. Check the backend terminal for API errors
3. Review `INTEGRATION_GUIDE.md` for detailed info
4. Ensure MongoDB is connected
5. Verify all environment variables are set

---

**Happy Trading! 📈**
