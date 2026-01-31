# 📊 Trading Journal Pro+

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20App-success?style=for-the-badge)](https://trade-journal-4z6fpd1ij-patelaryan2106-5559s-projects.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Yash-109/Trading-Journal)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

**Professional full-stack trading journal for disciplined traders**

Track every trade, analyze patterns, maintain discipline, and improve your trading performance through data-driven insights.

---

## ✨ Features

- **📝 Trade Logging** - Complete CRUD with auto-calculated P/L and R:R ratios
- **📊 Advanced Analytics** - 10+ interactive charts including Decision Quality Analytics
- **🧠 Daily Reflection** - Mood tracking and trading psychology journaling
- **📋 Rule Management** - Personal rulebook with compliance tracking
- **⚙️ Multi-Market Support** - FOREX, Crypto, and Indian F&O (with strikes, expiry, option type)
- **📈 Discipline Scoring** - Configurable analytics engine (Phase 6C)
- **💾 Data Management** - Export/import, local save, auto-save every 5 minutes
- **📱 PWA Support** - Install as app on mobile devices

---

## 🚀 Quick Start

### Online Access (No Installation)
**Visit:** https://trade-journal-4z6fpd1ij-patelaryan2106-5559s-projects.vercel.app

**Mobile:** Add to home screen for app-like experience (iOS/Android)

### Local Development

```bash
# Clone repository
git clone https://github.com/Yash-109/Trading-Journal.git
cd Trading-Journal

# Install dependencies (frontend + backend)
npm run install:all

# Configure environment
cd backend && cp .env.example .env
cd ../frontend && echo "VITE_API_URL=http://localhost:5000/api" > .env

# Run servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

**See [SETUP.md](SETUP.md) for complete installation instructions**

---

## 🏗️ Architecture

### Full-Stack Application

```
Frontend (React + Vite)
    ↓ REST API
Backend (Node.js + Express)
    ↓
MongoDB Database
```

**Frontend:** React 18, Vite, Tailwind CSS, Recharts, Framer Motion  
**Backend:** Express, Mongoose, JWT Authentication, bcrypt  
**Database:** MongoDB with Mongoose ODM

**See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details**

---

## 📊 Decision Quality Analytics (Phase 6C)

### Three-Layer Architecture

**Layer 1: Metrics Layer** - Pure facts (rule follow rate, trade quality, emotion stability)  
**Layer 2: Configuration Layer** - Centralized weights and thresholds  
**Layer 3: Rule Engine** - Computes discipline score (0-100)

**Configurable:** Change weights without touching code

```javascript
// Modify weights in one place
weights: {
  ruleFollow: 0.35,
  tradeQuality: 0.30,
  emotionStability: 0.20,
  winRate: 0.15
}
```

**Analytics Include:**
- Overall Discipline Score (Good/Average/Poor)
- Rule-followed vs rule-broken performance
- Trade quality buckets (1-3, 4-6, 7-10)
- Emotion-wise performance analysis

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS |
| **UI/UX** | Framer Motion, Lucide Icons, React Hot Toast |
| **Charts** | Recharts |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB (local or Atlas) |
| **Auth** | JWT, bcrypt |
| **Deployment** | Vercel (frontend), Railway/Render (backend) |

---

## 📁 Project Structure

```
TradingJournal/
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── context/         # State management
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   └── utils/           # Decision quality analytics
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth & validation
│   │   └── server.js
│   └── package.json
└── Documentation/
    ├── README.md            # This file
    ├── SETUP.md             # Installation guide
    ├── DEPLOYMENT.md        # Deployment instructions
    └── ARCHITECTURE.md      # Technical architecture
```

---

## 🎯 Use Cases

- **Day Traders** - Track intraday performance across sessions
- **Swing Traders** - Analyze multi-day trades and patterns
- **Forex Traders** - Monitor currency pairs and correlations
- **Crypto Traders** - Track volatile crypto markets
- **Indian F&O** - Options and futures with strikes, expiry tracking
- **Psychology Focus** - Understand emotional patterns
- **Discipline Building** - Enforce personal trading rules

---

## 💾 Data Management

### Full-Stack Version (With Backend)
- Automatic cloud sync via MongoDB
- Login from any device
- No manual export/import needed

### Frontend-Only Version
- Local browser storage (IndexedDB)
- Manual export/import (JSON files)
- Auto-save every 5 minutes
- Cross-device transfer via backup files

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save data |
| `Alt + 1-6` | Navigate pages |
| `Ctrl/Cmd + /` | Show shortcuts |

---

## 🚀 Deployment

**Frontend:** Vercel, Netlify, or GitHub Pages  
**Backend:** Railway, Render, or Heroku  
**Database:** MongoDB Atlas (free tier)

**See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions**

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Installation and configuration
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture and design patterns

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open Pull Request

---

## 📜 License

MIT License - Free to use and modify

---

## 🙏 Acknowledgments

Built with ❤️ for traders who value discipline, data, and continuous improvement.

**Key Design Principles:**
- **Configurable** - Change analytics rules without code changes
- **Privacy-First** - Your data, your control
- **Future-Proof** - Clean architecture for easy extensions
- **User-Centric** - Designed by traders, for traders

---

## ⭐ Star This Project

If you find this useful, please star the repository!

---

**Trade Smart. Trade Disciplined. Track Everything. 🚀📊**
