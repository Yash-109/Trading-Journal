# Trading Journal - Full Stack Refactoring Guide

## 🏗️ New Project Structure

The project has been refactored from a single frontend app to a full-stack application:

```
TradingJournal/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── context/   # AppContext (ready for API integration)
│   │   ├── pages/
│   │   └── utils/
│   ├── public/
│   └── package.json
│
├── backend/           # Node.js + Express backend API
│   ├── src/
│   │   ├── config/    # Database configuration
│   │   ├── models/    # Mongoose schemas (User, Trade, Reflection, Rule)
│   │   ├── routes/    # API route definitions
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth & error handling middleware
│   │   └── server.js     # Main entry point
│   ├── .env.example
│   └── package.json
│
└── FULLSTACK_README.md (this file)
```

## 🔄 What Changed

### ✅ Completed Refactoring
1. **Folder Structure**
   - Created `/frontend` and `/backend` directories
   - Moved all React app files to `/frontend`
   - Created backend folder structure (models, routes, controllers, middleware)

2. **Frontend Cleanup**
   - ❌ Removed `idb` (IndexedDB) dependency
   - ❌ Removed `chart.js` and `react-chartjs-2` dependencies
   - ❌ Removed all offline storage logic
   - ❌ Removed localStorage sync functions
   - ✅ Kept Recharts for visualizations
   - ✅ Updated AppContext with TODO comments for API integration

3. **Backend Setup**
   - ✅ Created `package.json` with dependencies:
     - express
     - mongoose
     - bcrypt
     - jsonwebtoken
     - cors
     - dotenv
     - express-validator
   - ✅ Created `.env.example` and `.gitignore`
   - ✅ Created placeholder files for all backend modules

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` from template:
```bash
cp .env.example .env
```

4. Configure your `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/trading_journal
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

5. Start backend:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## 📝 Implementation TODO

### Backend (Not Implemented Yet)

#### 1. Database Configuration
- [ ] Implement MongoDB connection in `src/config/database.js`
- [ ] Add connection error handling
- [ ] Add connection retry logic

#### 2. Models (Mongoose Schemas)
- [ ] **User Model** (`src/models/User.js`)
  - username, email, password (hashed)
  - createdAt, updatedAt
  - Pre-save hook for password hashing
  - Method to compare passwords
  - Method to generate JWT

- [ ] **Trade Model** (`src/models/Trade.js`)
  - userId (ref to User)
  - pair, strategy, entryPrice, exitPrice
  - size, pnl, riskReward
  - entryDate, exitDate
  - notes, emotion, session
  - screenshots array

- [ ] **Reflection Model** (`src/models/Reflection.js`)
  - userId (ref to User)
  - date (unique per user)
  - content, mood, lessons
  - createdAt, updatedAt

- [ ] **Rule Model** (`src/models/Rule.js`)
  - userId (ref to User)
  - title, description
  - category, status
  - createdAt, updatedAt

#### 3. Middleware
- [ ] **Auth Middleware** (`src/middleware/auth.js`)
  - Verify JWT token
  - Attach user to request
  - Handle unauthorized access

- [ ] **Error Handler** (`src/middleware/errorHandler.js`)
  - Centralized error handling
  - Format error responses
  - Log errors in production

#### 4. Controllers
- [ ] **Auth Controller** (`src/controllers/authController.js`)
  - register(req, res)
  - login(req, res)
  - getProfile(req, res)
  - updateProfile(req, res)

- [ ] **Trade Controller** (`src/controllers/tradeController.js`)
  - createTrade(req, res)
  - getTrades(req, res) - with filtering
  - getTradeById(req, res)
  - updateTrade(req, res)
  - deleteTrade(req, res)

- [ ] **Reflection Controller** (`src/controllers/reflectionController.js`)
  - createReflection(req, res)
  - getReflections(req, res)
  - getReflectionByDate(req, res)
  - updateReflection(req, res)
  - deleteReflection(req, res)

- [ ] **Rule Controller** (`src/controllers/ruleController.js`)
  - createRule(req, res)
  - getRules(req, res)
  - updateRule(req, res)
  - deleteRule(req, res)
  - toggleRuleStatus(req, res)

#### 5. Routes
- [ ] **Auth Routes** (`src/routes/authRoutes.js`)
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/profile (protected)
  - PUT /api/auth/profile (protected)

- [ ] **Trade Routes** (`src/routes/tradeRoutes.js`)
  - All routes protected
  - GET /api/trades
  - POST /api/trades
  - GET /api/trades/:id
  - PUT /api/trades/:id
  - DELETE /api/trades/:id

- [ ] **Reflection Routes** (`src/routes/reflectionRoutes.js`)
  - All routes protected
  - GET /api/reflections
  - POST /api/reflections
  - GET /api/reflections/:date
  - PUT /api/reflections/:date
  - DELETE /api/reflections/:date

- [ ] **Rule Routes** (`src/routes/ruleRoutes.js`)
  - All routes protected
  - GET /api/rules
  - POST /api/rules
  - PUT /api/rules/:id
  - DELETE /api/rules/:id

#### 6. Server Setup
- [ ] **Main Server** (`src/server.js`)
  - Express app initialization
  - Middleware setup (cors, json, etc.)
  - Route mounting
  - Error handler
  - Database connection
  - Server startup

### Frontend (TODO)

#### 1. Authentication Context
- [ ] Create `AuthContext.jsx`
  - Login/logout state
  - User state
  - Token management
  - Auto-logout on token expiry

#### 2. API Service Layer
- [ ] Create `src/services/api.js`
  - Axios instance with interceptors
  - Token attachment
  - Error handling
  - Base URL configuration

#### 3. Update AppContext
- [ ] Replace all TODO comments with actual API calls
- [ ] Add error handling for API failures
- [ ] Add loading states
- [ ] Handle authentication errors

#### 4. Authentication Pages
- [ ] Create `src/pages/Login.jsx`
- [ ] Create `src/pages/Register.jsx`
- [ ] Add protected route wrapper
- [ ] Update router in `App.jsx`

#### 5. Update Components
- [ ] Update Navbar for auth (login/logout)
- [ ] Add loading spinners
- [ ] Handle API errors gracefully

## 🔐 Authentication Flow

```
1. User registers → POST /api/auth/register
2. Backend creates user with hashed password
3. Backend returns JWT token
4. Frontend stores token (localStorage/cookie)
5. Frontend includes token in all API requests
6. Backend verifies token via middleware
7. Backend attaches user to request
8. Controllers use req.user for user-specific data
```

## 📦 Technology Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Recharts
- Framer Motion
- React Hot Toast

### Backend
- Node.js + Express
- MongoDB + Mongoose
- bcrypt (password hashing)
- jsonwebtoken (JWT auth)
- CORS
- dotenv

## 🎯 Next Steps

1. **Backend Implementation**
   - Start with models → middleware → controllers → routes → server
   - Test each endpoint with Postman/Thunder Client

2. **Frontend Integration**
   - Create API service layer
   - Update AppContext with API calls
   - Add authentication pages
   - Test full integration

3. **Testing & Deployment**
   - Test all CRUD operations
   - Test authentication flow
   - Deploy backend (Railway/Render/Heroku)
   - Deploy frontend (Vercel/Netlify)
   - Update CORS and CLIENT_URL

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Note**: The UI has NOT been rewritten. All existing React components remain intact. Only the data layer has been refactored to prepare for backend integration.
