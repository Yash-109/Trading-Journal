# 🚀 Setup Guide - Trading Journal Pro+

Complete installation and setup instructions for local development.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **MongoDB** (Local or MongoDB Atlas)
  - Local: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **npm** or **yarn** (comes with Node.js)
- **Git** (for cloning the repository)

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Yash-109/Trading-Journal.git
cd Trading-Journal
```

### Step 2: Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Option 1: Install both at once (from root directory)
npm run install:all

# Option 2: Install separately
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create environment file:**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

3. **Edit `.env` file with your configuration:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/trading_journal
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/trading_journal
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   
   # Frontend URL (for CORS)
   CLIENT_URL=http://localhost:5173
   ```

   **Important Notes:**
   - Replace `your_super_secret_jwt_key_here` with a strong random string
   - If using MongoDB Atlas, replace with your connection string
   - Keep `.env` file secure and never commit it to version control

### Frontend Configuration

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Create environment file:**
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

   Or create `.env` manually:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## 🏃 Running the Application

### Method 1: Run Servers Separately

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Method 2: Production Build

```bash
# Build frontend for production
cd frontend
npm run build

# Serve built files (using a static server)
npm install -g serve
serve -s dist
```

---

## 🔐 First Time Setup

### 1. Create Your Account

1. Open **http://localhost:5173** in your browser
2. You'll be redirected to the **Login** page
3. Click **"Create one"** to go to **Register**
4. Enter your email and password
5. Click **"Create Account"**

### 2. Login

1. Enter your credentials on the **Login** page
2. Click **"Sign In"**
3. You'll be redirected to the **Dashboard**

### 3. Add Your First Trade

1. Navigate to **Journal** page
2. Click **"Add Trade"** button
3. Fill in the trade details:
   - **Date**: Auto-filled (modify if needed)
   - **Pair**: e.g., XAUUSD, BTCUSD, EURUSD
   - **Direction**: Buy or Sell
   - **Entry Price**: Where you entered
   - **Stop Loss**: Your stop (optional)
   - **Take Profit**: Your target (optional)
   - **Exit Price**: Where you closed
   - **Lot Size**: Position size
   - **Session**: London/New York/Asia
   - **Strategy**: Your trading strategy
   - **Emotion**: Your emotional state
   - **Quality**: Rate the trade 1-10
   - **Rule Followed**: Yes/No
   - **Notes**: Trade observations

4. **P/L and R:R are auto-calculated**
5. Click **"Add Trade"**

### 4. Set Up Trading Rules

1. Navigate to **Rules** page
2. Click **"Add Rule"**
3. Enter your trading rule (e.g., "Never risk more than 2% per trade")
4. Click **"Add Rule"**

**Or use suggested rules:**
- Click any suggested rule to add it instantly

### 5. Create Daily Reflection

1. Navigate to **Reflection** page
2. Select today's date
3. Click **"New Reflection"**
4. Choose your mood
5. Rate emotional balance (1-10)
6. Answer reflection questions:
   - What went well today?
   - What mistakes did I make?
   - What will I do better tomorrow?
7. Click **"Save Reflection"**

---

## 📱 Application Features

### Dashboard
- Real-time performance metrics
- Interactive equity curve
- Win/loss streak tracking
- Recent trades overview
- Daily motivational quotes

### Journal (Trade Logging)
- Complete CRUD operations
- Advanced search and filtering
- Auto-calculated P/L and R:R
- Trade quality ratings
- Rule compliance tracking

### Analytics
- Win/Loss distribution charts
- Rule compliance visualization
- Performance by pair analysis
- Session performance comparison
- Emotion impact tracking
- Strategy effectiveness
- **Decision Quality Analytics** (Phase 6C)
  - Overall Discipline Score
  - Rule-followed vs broken performance
  - Trade quality buckets analysis
  - Emotion-wise performance
- PDF report export

### Daily Reflection
- Calendar-based entries
- Mood tracking
- Guided reflection prompts
- Historical entries review

### Trading Rules
- Custom rulebook management
- Active/Inactive toggles
- Compliance rate tracking
- Suggested best practices

### Settings
- Theme customization
- Currency configuration
- Custom pairs and strategies
- Data export/import
- Account management

---

## 💾 Data Management

### Local Save/Load (Quick Save)

**Save Data:**
1. Go to **Settings** page
2. Click **"Save Data Locally"**
3. Data is stored in browser localStorage

**Load Data:**
1. Go to **Settings** page
2. Click **"Load Local Data"**
3. Data is restored from localStorage

**Auto-Save:**
- Data automatically saves every 5 minutes
- Last saved timestamp is displayed

### File Backup (Cross-Device)

**Export Data:**
1. Go to **Settings** → **File Backup** section
2. Click **"Download Backup File (JSON)"**
3. JSON file is downloaded to your computer

**Import Data:**
1. Go to **Settings** → **File Backup** section
2. Click **"Upload Backup File"**
3. Select your JSON backup file
4. Data is imported and merged

**Transfer Between Devices:**
1. Export JSON from Device A
2. Send file via email/cloud
3. Import JSON on Device B

---

## 🎯 Daily Workflow

### Morning (Before Trading)
1. Open app → **Dashboard**
2. Review yesterday's performance
3. Navigate to **Rules** → Review your rulebook
4. Check **Analytics** for patterns

### During Trading
1. **Journal** → Log each trade immediately
2. Fill all fields accurately
3. Be honest about emotions and rule compliance

### Evening (After Trading)
1. **Dashboard** → Review today's performance
2. **Reflection** → Create daily journal entry
3. **Analytics** → Identify patterns
4. **Settings** → Save/Export data

### Weekly Review
1. **Analytics** → Deep dive into all charts
2. Check discipline score
3. Review rule compliance
4. Analyze emotion impact
5. Adjust strategies as needed
6. **Settings** → Export backup

---

## 🔧 Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save data locally
- `Alt + 1` - Navigate to Dashboard
- `Alt + 2` - Navigate to Journal
- `Alt + 3` - Navigate to Analytics
- `Alt + 4` - Navigate to Reflection
- `Alt + 5` - Navigate to Rules
- `Alt + 6` - Navigate to Settings
- `Ctrl/Cmd + /` - Show keyboard shortcuts help

---

## 🎨 Color Coding

```
🟢 Green  = Profit / Wins / Good Performance
🔴 Red    = Loss / Poor Performance / Warnings
🟡 Gold   = Important / Highlights / Primary Actions
🔵 Blue   = Information / Neutral
⚪ Gray   = Inactive / Secondary / Disabled
```

---

## 🆘 Troubleshooting

### Backend Won't Start

**Problem:** MongoDB connection error
```
Solution:
1. Ensure MongoDB is running
   - Local: Start MongoDB service
   - Atlas: Check connection string
2. Verify MONGODB_URI in .env
3. Check MongoDB logs for errors
```

**Problem:** Port 5000 already in use
```
Solution:
1. Change PORT in backend/.env
2. Update VITE_API_URL in frontend/.env
3. Restart both servers
```

### Frontend Won't Load

**Problem:** "Cannot connect to server"
```
Solution:
1. Verify backend is running on http://localhost:5000
2. Check VITE_API_URL in frontend/.env
3. Clear browser cache
4. Check browser console (F12) for errors
```

**Problem:** Blank page or errors
```
Solution:
1. Check browser console (F12)
2. Verify all dependencies installed: npm install
3. Clear node_modules and reinstall:
   rm -rf node_modules package-lock.json
   npm install
4. Try different browser
```

### Authentication Issues

**Problem:** Can't login after registration
```
Solution:
1. Check JWT_SECRET is set in backend/.env
2. Verify MongoDB is storing user data
3. Check backend console for error messages
4. Clear localStorage and try again
```

### Data Not Persisting

**Problem:** Data disappears on refresh
```
Solution:
1. Ensure you're logged in
2. Check MongoDB connection
3. Verify backend API calls succeed (Network tab)
4. Export data as backup
```

### Charts Not Displaying

**Problem:** Analytics page shows no data
```
Solution:
1. Add at least one trade in Journal
2. Refresh the page
3. Check browser console for errors
4. Verify trades are saved in database
```

---

## 📊 Development Tips

### Using Sample Data

For testing, you can import sample data:
1. See `SAMPLE_DATA.md` for example JSON
2. Copy the JSON content
3. Save as `sample-data.json`
4. Import via **Settings** → **Upload Backup File**

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Vite automatically reloads on file changes
- **Backend**: Nodemon restarts server on file changes

### Database Tools

**MongoDB Compass** (GUI for MongoDB):
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`
- View/edit data directly

**MongoDB Atlas** (Cloud):
- View data in web dashboard
- Monitor performance
- Configure backups

---

## 🔒 Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong JWT secrets** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Change default passwords** - Don't use "password123" in production
4. **Enable HTTPS** - Use SSL certificates for production deployment
5. **Keep dependencies updated** - Run `npm audit` regularly

---

## 📚 Next Steps

1. **Review Architecture:** See `ARCHITECTURE.md` for technical details
2. **Deploy to Production:** See `DEPLOYMENT.md` for deployment guides
3. **Customize:** Modify trading pairs, strategies, and rules
4. **Start Trading:** Log your trades and track performance

---

## 🆘 Getting Help

- **Issues:** Check GitHub Issues page
- **Documentation:** See README.md and ARCHITECTURE.md
- **Console Logs:** Press F12 to view browser console
- **Backend Logs:** Check terminal where backend is running

---

**🎉 You're all set! Start your journey to disciplined, data-driven trading!**
