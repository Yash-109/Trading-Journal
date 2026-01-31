# 🏗️ Architecture Documentation - Trading Journal Pro+

Complete technical architecture and implementation details for the full-stack trading journal application.

---

## 📁 Project Structure

```
TradingJournal/
├── frontend/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── DataSyncBanner.jsx
│   │   │   ├── KeyboardShortcuts.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── TradeModal.jsx
│   │   ├── context/            # State management
│   │   │   ├── AppContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useTrades.js
│   │   ├── pages/              # Page components
│   │   │   ├── Analytics.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Journal.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Reflection.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Rules.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/           # API integration
│   │   │   └── api.js
│   │   ├── utils/              # Utility functions
│   │   │   └── decisionQualityAnalytics.js
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/
│   │   └── manifest.json       # PWA manifest
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.js    # MongoDB connection
│   │   │   └── db.js          # Database helper
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Trade.js
│   │   │   ├── Reflection.js
│   │   │   └── Rule.js
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── tradeController.js
│   │   │   ├── reflectionController.js
│   │   │   └── ruleController.js
│   │   ├── routes/           # API route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── tradeRoutes.js
│   │   │   ├── reflectionRoutes.js
│   │   │   └── ruleRoutes.js
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.js       # JWT verification
│   │   │   └── errorHandler.js
│   │   └── server.js         # Main entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
└── Documentation/
    ├── README.md             # Project overview
    ├── SETUP.md              # Installation guide
    ├── DEPLOYMENT.md         # Deployment instructions
    └── ARCHITECTURE.md       # This file
```

---

## 🎯 System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │            React Frontend (Vite)                   │    │
│  │  • Components  • Context  • Pages  • Hooks        │    │
│  └────────────────────┬───────────────────────────────┘    │
│                       │ HTTP/HTTPS (REST API)               │
└───────────────────────┼─────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────┐
│                       ▼       SERVER                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Node.js + Express Backend                  │    │
│  │  • Routes  • Controllers  • Middleware             │    │
│  └────────────────────┬───────────────────────────────┘    │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────┐    │
│  │         MongoDB Database (Mongoose)                │    │
│  │  • Users  • Trades  • Reflections  • Rules        │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### Registration & Login

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Client  │                │  Server  │                │ Database │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ POST /api/auth/register   │                           │
     ├──────────────────────────>│                           │
     │ { email, password }        │                           │
     │                           │ Hash password (bcrypt)    │
     │                           │                           │
     │                           │ Save user                 │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │ Generate JWT              │
     │                           │                           │
     │ { token, user }           │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │ Store token (localStorage)│                           │
     │                           │                           │
     │ POST /api/auth/login      │                           │
     ├──────────────────────────>│                           │
     │ { email, password }        │                           │
     │                           │ Find user                 │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │ Compare password (bcrypt) │
     │                           │                           │
     │                           │ Generate JWT              │
     │                           │                           │
     │ { token, user }           │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
```

### Protected Route Access

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Client  │                │  Server  │                │ Database │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ GET /api/trades           │                           │
     ├──────────────────────────>│                           │
     │ Authorization: Bearer JWT │                           │
     │                           │                           │
     │                           │ Verify JWT (middleware)   │
     │                           │                           │
     │                           │ Attach user to req        │
     │                           │                           │
     │                           │ Find trades by userId     │
     │                           ├──────────────────────────>│
     │                           │                           │
     │ { trades: [...] }         │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
```

---

## 🗄️ Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

**Methods:**
- `matchPassword(enteredPassword)` - Compare password with hash
- `generateToken()` - Create JWT token

### Trade Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  
  // Trade Details
  pair: String (e.g., "XAUUSD", "BTCUSD"),
  direction: String (enum: ['Buy', 'Sell']),
  market: String (enum: ['FOREX', 'CRYPTO', 'INDIAN']),
  
  // Indian Market Specific
  instrumentType: String (enum: ['INDEX', 'FNO']),
  optionType: String (enum: ['CE', 'PE', 'FUT']),
  strikePrice: Number,
  expiryDate: Date,
  
  // Prices
  entry: Number (required),
  stopLoss: Number,
  takeProfit: Number,
  exit: Number (required),
  
  // Position
  lotSize: Number (required),
  pnl: Number (calculated),
  rr: Number (risk:reward ratio),
  
  // Context
  date: Date (required),
  session: String (enum: ['London', 'New York', 'Asia']),
  strategy: String,
  
  // Quality Metrics
  ruleFollowed: Boolean (default: true),
  emotion: String (enum: ['Calm', 'Fear', 'Greed', 'Hesitant', 'Overconfident', 'Revenge']),
  tradeQuality: Number (1-10, default: 5),
  
  // Documentation
  notes: String,
  screenshot: String (URL),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Pre-save Hooks:**
- Calculate P/L automatically
- Calculate R:R ratio
- Normalize market fields

### Reflection Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  date: Date (required, unique per user),
  mood: String (required),
  emotionalBalance: Number (1-10),
  whatWentWell: String,
  mistakes: String,
  improvements: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Rule Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  title: String (required),
  description: String,
  active: Boolean (default: true),
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create new user account | No |
| POST | `/login` | Login and get JWT token | No |
| GET | `/profile` | Get current user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |

### Trade Routes (`/api/trades`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all user trades | Yes |
| POST | `/` | Create new trade | Yes |
| GET | `/:id` | Get single trade by ID | Yes |
| PUT | `/:id` | Update trade | Yes |
| DELETE | `/:id` | Delete trade | Yes |

**Query Parameters for GET /:**
- `pair` - Filter by trading pair
- `direction` - Filter by Buy/Sell
- `market` - Filter by FOREX/CRYPTO/INDIAN
- `startDate`, `endDate` - Date range filter
- `emotion` - Filter by emotion
- `strategy` - Filter by strategy
- `ruleFollowed` - Filter by true/false

### Reflection Routes (`/api/reflections`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all user reflections | Yes |
| POST | `/` | Create new reflection | Yes |
| GET | `/:date` | Get reflection by date | Yes |
| PUT | `/:date` | Update reflection | Yes |
| DELETE | `/:date` | Delete reflection | Yes |

### Rule Routes (`/api/rules`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all user rules | Yes |
| POST | `/` | Create new rule | Yes |
| PUT | `/:id` | Update rule | Yes |
| DELETE | `/:id` | Delete rule | Yes |
| PATCH | `/:id/toggle` | Toggle rule active status | Yes |

---

## 🎨 Frontend Architecture

### State Management

#### AuthContext (`src/context/AuthContext.jsx`)

**Purpose:** Manages authentication state globally

**State:**
```javascript
{
  isAuthenticated: boolean,
  user: { id, email },
  isLoading: boolean
}
```

**Methods:**
- `login(email, password)` - Authenticate user
- `register(email, password)` - Create new account
- `logout()` - Clear session and redirect
- `checkAuth()` - Verify token validity

#### AppContext (`src/context/AppContext.jsx`)

**Purpose:** Manages application data and settings

**State:**
```javascript
{
  trades: [],
  reflections: [],
  rules: [],
  settings: {
    theme: 'dark',
    currency: 'USD',
    pairs: [],
    strategies: []
  }
}
```

**Methods:**
- `loadAllData()` - Fetch all user data from API
- `addTrade(trade)` - Create trade via API
- `updateTrade(id, updates)` - Update trade via API
- `deleteTrade(id)` - Delete trade via API
- `addReflection(reflection)` - Create reflection via API
- `deleteReflection(date)` - Delete reflection via API
- `addRule(rule)` - Create rule via API
- `updateRule(id, updates)` - Update rule via API
- `deleteRule(id)` - Delete rule via API
- `exportData()` - Export all data as JSON
- `importData(jsonData)` - Import data from JSON

### API Service Layer (`src/services/api.js`)

**Purpose:** Centralized API communication with error handling

**Configuration:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**Features:**
- Automatic JWT token attachment
- 401 error handling (auto-logout)
- Response formatting
- Error message extraction

**API Groups:**

```javascript
// Authentication
authAPI.register(email, password)
authAPI.login(email, password)

// Trades
tradesAPI.getAll(filters)
tradesAPI.create(tradeData)
tradesAPI.update(id, updates)
tradesAPI.delete(id)

// Reflections
reflectionsAPI.getAll()
reflectionsAPI.create(reflectionData)
reflectionsAPI.delete(date)

// Rules
rulesAPI.getAll()
rulesAPI.create(ruleData)
rulesAPI.update(id, updates)
rulesAPI.delete(id)
```

### Custom Hooks

#### useTrades (`src/hooks/useTrades.js`)

**Purpose:** Normalize and transform trade data

**Features:**
- Calculate display pair based on market
- Add computed fields
- Handle Indian market specifics
- Sort and filter trades

---

## 📊 Decision Quality Analytics (Phase 6C)

### Three-Layer Architecture

Located in: `src/utils/decisionQualityAnalytics.js`

#### Layer 1: Metrics Layer (Pure Facts)

Computes raw statistics without interpretation:

```javascript
computeRawMetrics(trades) → {
  totalTrades: number,
  ruleFollowRate: number (0-100),
  avgTradeQuality: number (1-10),
  winRate: number (0-100),
  pnlConsistency: number (0-100),
  emotionStability: number (0-100),
  emotionDistribution: object,
  tradeQualityDistribution: object
}
```

**Additional Metrics:**
- `computeRuleComparisonMetrics()` - Compare rule-followed vs broken
- `computeQualityBucketMetrics()` - Performance by quality (1-3, 4-6, 7-10)
- `computeEmotionPerformanceMetrics()` - Performance by emotion

#### Layer 2: Rule Configuration Layer

**Centralized Config Object:**

```javascript
DECISION_RULE_CONFIG = {
  weights: {
    ruleFollow: 0.35,       // 35% weight
    tradeQuality: 0.30,     // 30% weight
    emotionStability: 0.20, // 20% weight
    winRate: 0.15           // 15% weight
  },
  
  thresholds: {
    good: 70,     // >= 70 = Good Discipline
    average: 50   // >= 50 = Average Discipline
  },
  
  emotionConfig: {
    emotionScores: {
      'Calm': 10,
      'Hesitant': 6,
      'Fear': 4,
      'Greed': 3,
      'Overconfident': 2,
      'Revenge': 0
    },
    maxScore: 10
  },
  
  qualityBuckets: {
    poor: { min: 1, max: 3 },
    average: { min: 4, max: 6 },
    good: { min: 7, max: 10 }
  }
}
```

**Configurable:** Change weights and thresholds without touching logic

#### Layer 3: Rule Engine Layer

**Purpose:** Apply config to metrics

```javascript
computeDisciplineScore(metrics, config) → {
  disciplineScore: number (0-100),
  disciplineLabel: string ('Good'|'Average'|'Poor'),
  breakdown: {
    ruleFollow: { value, weight, weighted },
    tradeQuality: { value, weight, weighted },
    emotionStability: { value, weight, weighted },
    winRate: { value, weight, weighted }
  }
}
```

**Formula:**
```
disciplineScore = 
  (ruleFollowRate × 0.35) +
  (normalizedTradeQuality × 0.30) +
  (emotionStability × 0.20) +
  (winRate × 0.15)
```

### Analytics Display

**Components in Analytics Page:**

1. **Overall Discipline Score Card**
   - Circular progress indicator (0-100)
   - Color-coded label (Good/Average/Poor)
   - Detailed breakdown with progress bars

2. **Rule-Followed vs Rule-Broken Performance**
   - Side-by-side comparison cards
   - Metrics: trades, win rate, avg P/L, total P/L

3. **Trade Quality Buckets**
   - Three-column layout (Poor/Average/Good)
   - Performance metrics per bucket

4. **Emotion-wise Performance Table**
   - All emotions with performance data
   - Sorted by total P/L

---

## 🔄 Data Flow

### Creating a Trade

```
1. User fills TradeModal form
2. Form validates input
3. AppContext.addTrade() called
4. API.tradesAPI.create() sends POST request
5. Backend auth middleware validates JWT
6. Controller validates data
7. Trade saved to MongoDB
8. Response returned with saved trade
9. AppContext updates local state
10. Journal page re-renders with new trade
11. Dashboard/Analytics update automatically
```

### Loading Application Data

```
1. User logs in successfully
2. AuthContext sets isAuthenticated = true
3. AppContext.loadAllData() triggered
4. Parallel API calls:
   - GET /api/trades
   - GET /api/reflections
   - GET /api/rules
5. All responses merged
6. AppContext state updated
7. All pages access data via context
8. Components render with real data
```

---

## 🛡️ Security Measures

### Backend Security

1. **Password Hashing:** bcrypt with salt rounds
2. **JWT Tokens:** Signed with secret key
3. **Token Expiry:** 7 days default
4. **Protected Routes:** Auth middleware on all data endpoints
5. **Input Validation:** express-validator on all inputs
6. **CORS:** Configured for specific origins
7. **Environment Variables:** Sensitive data in .env

### Frontend Security

1. **Token Storage:** localStorage (consider httpOnly cookies)
2. **Automatic Logout:** On 401 errors
3. **Protected Routes:** Redirect to login if not authenticated
4. **XSS Prevention:** React's built-in escaping
5. **HTTPS:** Required in production

---

## 🎨 Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **express-validator** - Input validation

### Development Tools
- **nodemon** - Auto-restart backend
- **Vite HMR** - Hot module replacement
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📈 Performance Considerations

### Frontend Optimization

1. **Code Splitting:** React.lazy() for route-based splitting
2. **Memoization:** useMemo() for expensive calculations
3. **Context Optimization:** Separate Auth and App contexts
4. **Asset Optimization:** Vite's built-in optimization
5. **PWA Support:** Offline capability with service workers

### Backend Optimization

1. **Database Indexing:** Indexes on userId, date fields
2. **Query Optimization:** Lean queries, projection
3. **Connection Pooling:** MongoDB connection pool
4. **Caching:** Consider Redis for frequent queries
5. **Pagination:** Limit results for large datasets

---

## 🚀 Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel/Netlify                           │
│                  (Frontend Hosting)                          │
│         React App served as static files                     │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Railway/Render/Heroku                           │
│               (Backend Hosting)                              │
│           Node.js + Express API Server                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 MongoDB Atlas                                │
│             (Database Hosting)                               │
│              Cloud Database Cluster                          │
└─────────────────────────────────────────────────────────────┘
```

### Environment Variables (Production)

**Backend:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-secret>
JWT_EXPIRE=7d
CLIENT_URL=https://your-app.vercel.app
```

**Frontend:**
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🔮 Future Enhancements

### Planned Features

1. **Real-time Sync:** WebSocket for live updates
2. **Advanced Analytics:** Machine learning insights
3. **Social Features:** Share trades with community
4. **Mobile Apps:** React Native versions
5. **Backtesting:** Historical strategy testing
6. **Alerts:** Email/SMS notifications
7. **Multi-currency:** Support for all currencies
8. **Team Features:** Shared journals for groups

### Technical Improvements

1. **TypeScript:** Add type safety
2. **GraphQL:** Replace REST API
3. **Redis:** Add caching layer
4. **Docker:** Containerization
5. **CI/CD:** Automated testing and deployment
6. **Monitoring:** Error tracking and analytics
7. **Load Balancing:** Horizontal scaling
8. **CDN:** Global content delivery

---

## 📚 Additional Resources

- **API Documentation:** Use Postman/Swagger for API docs
- **Database Schema:** See models directory
- **Component Library:** See components directory
- **Styling Guide:** Tailwind CSS documentation
- **Testing:** Jest + React Testing Library (planned)

---

**Last Updated:** January 2026  
**Version:** 2.0 (Full-Stack with Phase 6C Analytics)
