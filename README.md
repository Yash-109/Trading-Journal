# 📊 Trading Journal Pro+

A professional-grade web application for active traders to log, analyze, and continuously improve their trading performance, psychology, and discipline.

![Trading Journal Pro+](https://img.shields.io/badge/version-1.0.0-gold)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Overview

**Trading Journal Pro+** is a comprehensive trading journal designed for forex, crypto, and indices traders like Aryan Patel. It helps you:

- 📝 Log daily trades with detailed metrics
- 📊 Analyze performance with advanced charts and statistics
- 🧠 Track emotions and trading psychology
- ✅ Maintain discipline with customizable trading rules
- 📈 Monitor equity curves and win rates
- 💾 Backup and export all your data

## ✨ Key Features

### 1. **Dashboard**
- Real-time performance overview
- Total trades, win rate, average R:R, total P/L
- Equity curve visualization
- Current streak tracker
- Consistency score
- Quick insights and alerts

### 2. **Trade Journal**
- Comprehensive trade logging
- Auto-calculated P/L and Risk:Reward ratios
- Advanced filtering by pair, emotion, strategy, session
- Trade quality rating (1-10)
- Rule compliance tracking
- Notes and lessons learned
- Duplicate trades for similar setups

### 3. **Analytics**
- Win/Loss distribution charts
- Performance by trading pair
- Session analysis (London, NY, Asia)
- Emotion impact tracking
- Strategy comparison
- Rule compliance visualization
- Exportable PDF reports

### 4. **Daily Reflection**
- Calendar-based journal entries
- Guided reflection prompts
- Mood tracking with emojis
- Emotional balance scoring
- What went well / Mistakes / Improvements

### 5. **Trading Rules**
- Custom rulebook creation
- Rule compliance tracking
- Active/Inactive rule toggling
- Suggested best practices
- Compliance rate monitoring

### 6. **Settings**
- Dark/Light theme (dark default)
- Custom trading pairs
- Custom strategies
- Data export/import (JSON)
- Local IndexedDB storage
- Clear all data option

## 🚀 Tech Stack

- **Frontend:** React 18.2 with Hooks
- **Styling:** Tailwind CSS (dark theme)
- **Animations:** Framer Motion
- **Charts:** Recharts + Chart.js
- **Storage:** IndexedDB (idb library)
- **Routing:** React Router v6
- **PDF Export:** jsPDF
- **Notifications:** React Hot Toast
- **Icons:** Lucide React
- **Build Tool:** Vite
- **UUID Generation:** uuid library

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn installed

### Setup Steps

1. **Clone or navigate to the project directory:**
```powershell
cd "f:\Trade Journal"
```

2. **Install dependencies:**
```powershell
npm install
```

3. **Start the development server:**
```powershell
npm run dev
```

4. **Open your browser:**
The app will automatically open at `http://localhost:3000`

## 🛠️ Available Scripts

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
f:\Trade Journal\
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── StatCard.jsx    # Statistics card component
│   │   └── TradeModal.jsx  # Trade add/edit modal
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.jsx   # Overview and stats
│   │   ├── Journal.jsx     # Trade logging
│   │   ├── Analytics.jsx   # Performance analysis
│   │   ├── Reflection.jsx  # Daily reflections
│   │   ├── Rules.jsx       # Trading rules
│   │   └── Settings.jsx    # App configuration
│   ├── context/
│   │   └── AppContext.jsx  # Global state management
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

## 💾 Data Structure

### Trade Object
```javascript
{
  id: UUID,
  date: Date,
  pair: String,              // e.g., "XAUUSD"
  direction: "Buy" | "Sell",
  entry: Number,
  stopLoss: Number,
  takeProfit: Number,
  exit: Number,
  lotSize: Number,
  profitLoss: Number,        // Auto-calculated
  rr: Number,                // Risk:Reward ratio
  session: String,           // London, NY, Asia, Sydney
  strategy: String,
  ruleFollowed: Boolean,
  emotion: String,           // Calm, Fear, Greed, etc.
  tradeQuality: Number,      // 1-10 rating
  screenshot: String,
  notes: String
}
```

### Reflection Object
```javascript
{
  date: Date,
  whatWentWell: String,
  mistakes: String,
  improvement: String,
  mood: String,              // great, good, neutral, bad, terrible
  emotionalBalance: Number   // 1-10 rating
}
```

### Rule Object
```javascript
{
  id: UUID,
  text: String,
  active: Boolean
}
```

## 🎨 UI Features

- **Dark Theme:** Professional trading terminal aesthetic
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Smooth Animations:** Framer Motion powered transitions
- **Color-Coded:** Green for profit, Red for loss, Gold for highlights
- **Modal-Based:** Focused trade input experience
- **Toast Notifications:** Real-time feedback

## 📊 Analytics Insights

The app automatically generates:
- ✅ Win rate percentages
- 📈 Equity curve charts
- 🎯 Performance by trading pair
- ⏰ Session performance analysis
- 😊 Emotion impact tracking
- 📋 Strategy effectiveness
- ✔️ Rule compliance rates
- 🔥 Win/loss streaks
- 🎖️ Consistency scores

## 💡 Usage Tips

1. **Log Every Trade:** Consistency is key to accurate analytics
2. **Daily Reflections:** Take 5 minutes each day to reflect
3. **Follow Rules:** Track compliance to improve discipline
4. **Regular Backups:** Export your data weekly
5. **Review Analytics:** Check performance metrics weekly
6. **Track Emotions:** Identify emotional patterns affecting results
7. **Quality Over Quantity:** Rate each trade setup quality
8. **Learn From Mistakes:** Use notes field extensively

## 🔒 Privacy & Security

- ✅ **100% Local:** All data stored in browser's IndexedDB
- ✅ **No Server:** No data sent to external servers
- ✅ **Offline-First:** Works without internet
- ✅ **Export Control:** You own your data
- ✅ **No Tracking:** No analytics or tracking scripts

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

## 🚧 Future Enhancements

- [ ] Cloud backup with Firebase
- [ ] CSV export for trades
- [ ] Advanced charting (candlestick overlay)
- [ ] Trade screenshots upload
- [ ] AI-powered insights
- [ ] Weekly email reports
- [ ] Mobile app (React Native)
- [ ] Multi-account support
- [ ] Performance comparison with benchmarks
- [ ] Trade alerts and reminders

## 🤝 Contributing

This is a personal project by Aryan Patel. Feel free to fork and customize for your own use.

## 📄 License

MIT License - Free to use and modify

## 👨‍💻 Developer

**Aryan Patel**
- Professional Trader
- Full-Stack Developer
- Trading Journal Enthusiast

## 🙏 Acknowledgments

Built with passion for traders who want to improve through data-driven self-reflection.

---

### 📞 Support

For issues or questions, please check the browser console for errors and ensure you're using a modern browser with IndexedDB support.

---

**Remember:** The best traders are disciplined traders. Use this journal daily, track everything, and continuously improve! 🚀📈

---

## Quick Start Checklist

- [x] Install dependencies: `npm install`
- [x] Start dev server: `npm run dev`
- [ ] Add your first trade
- [ ] Create your trading rules
- [ ] Log your first reflection
- [ ] Explore analytics
- [ ] Export backup

**Happy Trading! 📊💰**
