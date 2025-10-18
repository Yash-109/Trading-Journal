# 📊 Trading Journal Pro+

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20App-success?style=for-the-badge)](https://trade-journal-4z6fpd1ij-patelaryan2106-5559s-projects.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Aryan1438/Trading_Journal)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

**Professional-Grade Trading Journal for Active Traders** 🚀

A comprehensive web application designed to help traders track, analyze, and improve their trading performance with advanced analytics, daily reflections, and rule management.

---

## 🌐 Live Links

- **🚀 Live App:** https://trade-journal-4z6fpd1ij-patelaryan2106-5559s-projects.vercel.app
- **📂 GitHub Repo:** https://github.com/Aryan1438/Trading_Journal
- **📊 Vercel Dashboard:** https://vercel.com/patelaryan2106-5559s-projects/trade-journal

---

## ✨ Key Features

### 📈 **Dashboard**
- Real-time performance metrics (Win Rate, Total P/L, Average RR)
- Interactive equity curve visualization
- Advanced filtering by date range
- Motivational trading quotes

### 📝 **Trade Journal**
- Complete trade logging system with all essential fields
- Auto-calculated P/L and Risk:Reward ratios
- Advanced search and filtering (by pair, date, emotion, strategy)
- Edit and delete functionality with confirmation

### 📊 **Analytics**
- 6+ interactive charts:
  - Equity curve over time
  - Win rate pie chart
  - Performance by currency pair
  - Emotion distribution analysis
  - Session performance comparison
  - Strategy effectiveness breakdown
- Auto-generated insights and recommendations

### 🧠 **Daily Reflection**
- Daily journaling with mood tracking
- Prompted reflection questions
- Calendar view of past entries
- Track trading psychology patterns

### 📋 **Trading Rules**
- Personal rulebook management
- Active/inactive rule toggling
- Rule compliance tracking
- Discipline reinforcement

### ⚙️ **Settings & Data Management**
- **Local Save/Load**: Quick save to this device
- **File Export/Import**: Transfer data between devices
- **Auto-Save**: Automatic backup every 5 minutes
- **Theme Toggle**: Dark/Light mode support
- **Custom Pairs & Strategies**: Personalize your setup

---

## 🚀 Quick Start

### Use Online (No Installation)

**Simply visit:** https://trade-journal-4z6fpd1ij-patelaryan2106-5559s-projects.vercel.app

**On Mobile:**
1. Open the link in your browser
2. **iOS**: Safari → Share → "Add to Home Screen"
3. **Android**: Chrome → Menu → "Add to Home Screen"
4. Works like a native app! 📱

### Run Locally

```bash
# Clone the repository
git clone https://github.com/Aryan1438/Trading_Journal.git

# Navigate to project folder
cd Trading_Journal

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access locally at:** `http://localhost:3000`

---

## 💾 Data Sync Workflow

### Transfer Data Between Devices:

1. **On Laptop:**
   - Go to Settings
   - Click "Download Backup File (JSON)"
   - Save file to cloud/email/USB

2. **On Phone:**
   - Open app (using live link)
   - Go to Settings
   - Click "Upload Backup File"
   - Select downloaded file
   - ✅ Data synced!

### Auto-Features:
- ⏰ Auto-save every 5 minutes
- 💾 Local save button always available
- ⚠️ Warning banner for unsaved data
- 🔄 Online/Offline status indicator

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save data locally |
| `Alt + 1` | Go to Dashboard |
| `Alt + 2` | Go to Journal |
| `Alt + 3` | Go to Analytics |
| `Alt + 4` | Go to Reflection |
| `Alt + 5` | Go to Rules |
| `Alt + 6` | Go to Settings |
| `Ctrl/Cmd + /` | Show shortcuts help |

---

## 🛠️ Tech Stack

- **Frontend:** React 18.2 + Vite
- **Styling:** Tailwind CSS (Custom dark theme)
- **Routing:** React Router v6
- **Animation:** Framer Motion
- **Charts:** Recharts + Chart.js
- **Storage:** IndexedDB (idb) + LocalStorage
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Export:** jsPDF
- **Deployment:** Vercel
- **Version Control:** Git + GitHub

---

## 📂 Project Structure

```
Trading_Journal/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── StatCard.jsx            # Statistic cards
│   │   ├── TradeModal.jsx          # Trade entry form
│   │   ├── DataSyncBanner.jsx      # Data warning banner
│   │   └── KeyboardShortcuts.jsx   # Keyboard shortcuts
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── Journal.jsx             # Trade logging
│   │   ├── Analytics.jsx           # Performance charts
│   │   ├── Reflection.jsx          # Daily journaling
│   │   ├── Rules.jsx               # Trading rules
│   │   └── Settings.jsx            # Configuration
│   ├── context/
│   │   └── AppContext.jsx          # Global state + DB
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
├── public/
│   └── manifest.json               # PWA manifest
├── DEPLOYMENT.md                   # Deploy guide
├── QUICK_START.md                  # Getting started
├── UI_DESIGN.md                    # Design system
├── vercel.json                     # Vercel config
└── package.json                    # Dependencies
```

---

## 🎨 Design System

**Color Palette:**
- Primary: Gold (#f59e0b)
- Background: Charcoal (#0f0f0f, #1a1a1a)
- Text: White (#ffffff) / Gray (#9ca3af)
- Success: Green (#10b981)
- Danger: Red (#ef4444)
- Warning: Yellow (#f59e0b)

**Typography:** Inter font family (Google Fonts)

**Theme:** Dark mode optimized for reduced eye strain during long trading sessions

---

## 📊 Features Status

| Feature | Status | Description |
|---------|--------|-------------|
| Trade Logging | ✅ | Complete CRUD operations |
| Analytics | ✅ | 6+ interactive charts |
| Daily Reflection | ✅ | Mood tracking + journaling |
| Rule Management | ✅ | Personal rulebook |
| Data Export | ✅ | JSON backup files |
| Data Import | ✅ | Restore from backup |
| Local Save | ✅ | Quick device save |
| Auto-Save | ✅ | Every 5 minutes |
| Keyboard Shortcuts | ✅ | Navigation + actions |
| PWA Support | ✅ | Add to home screen |
| Dark/Light Theme | ✅ | Toggle in settings |
| Mobile Responsive | ✅ | Optimized for all screens |
| Offline Mode | ✅ | Works after first load |
| Vercel Deployment | ✅ | Live production URL |
| GitHub Repository | ✅ | Version controlled |

---

## 🔐 Privacy & Security

- ✅ **100% Local Storage**: All data stored in browser IndexedDB
- ✅ **No Server Uploads**: No data sent to any external server
- ✅ **No Authentication**: No passwords or login required
- ✅ **Full Control**: You own your data completely
- ✅ **Exportable**: Download all data anytime as JSON

---

## 📈 Performance

- **First Load:** ~2-3 seconds
- **Subsequent Loads:** <1 second (cached)
- **Offline Capability:** Yes (after first load)
- **Storage Usage:** ~1-5MB for typical journal
- **Mobile Data:** Minimal (~500KB initial load)

---

## 🚀 Deployment

This project is deployed on **Vercel** with automatic deployments from the `main` branch.

### Deploy Your Own:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or click here: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Aryan1438/Trading_Journal)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

**Issues or Questions?**
1. Check `DEPLOYMENT.md` for deployment help
2. Open an issue on GitHub
3. Check browser console for errors (F12)
4. Verify dependencies: `npm list`

---

## 📜 License

MIT License - Free to use and modify

---

## 🙏 Acknowledgments

Built with ❤️ for traders who take their craft seriously.

**Special Features:**
- Auto-save every 5 minutes
- Keyboard shortcuts for power users
- PWA support for mobile
- Cross-device data transfer
- Psychology tracking
- Rule enforcement

---

## 🎯 Roadmap

**Coming Soon:**
- [ ] Cloud sync (optional)
- [ ] Multi-currency support
- [ ] Advanced reporting (PDF)
- [ ] Trade screenshots upload
- [ ] Performance benchmarking
- [ ] Social sharing (anonymous)
- [ ] Desktop app (Electron)

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/0f0f0f/f59e0b?text=Dashboard+View)

### Trade Journal
![Journal](https://via.placeholder.com/800x400/0f0f0f/f59e0b?text=Trade+Journal)

### Analytics
![Analytics](https://via.placeholder.com/800x400/0f0f0f/f59e0b?text=Analytics+Charts)

---

## 📱 QR Code for Mobile Access

Scan this QR code to open the app on your phone:

```
█████████████████████████████████
█████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄▄█▄█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀ ▄█ █   █ ████
████ █▄▄▄█ █▀ █▀▀█ ▀█ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ ▀▄█ █▄█▄▄▄▄▄▄████
████ ▄▄ █▄▄ ▄▀▀▀▀▄ █▀▄ ▀▄▀ █████
████▄▀▀█ ▀▄  ▄█▀ ▀ ▀▀▄▀▀▀▄▄█████
████ ▀▄██▀▄█▀▀█  ▀▄▄ ▄▀▄ ▀▄▀████
████ ▄▄▄▄▄ █ ██ ▄▀▀  ▀▄▀▄█▀█████
████ █   █ █ ▄█▄▄▄▄██▀█▄▄▀▀█████
████ █▄▄▄█ █ ▀ ▀ ▀▀▀ ▄▀ ▄▄▄█████
████▄▄▄▄▄▄▄█▄▄███▄█▄▄█▄█▄▄██████
█████████████████████████████████
█████████████████████████████████
```

Or use this link: https://trade-journal-4z6fpd1ij-patelaryan2106-5559s-projects.vercel.app

---

**Made for traders, by a developer who understands the game. Trade smart. Trade disciplined. 🚀📊**

---

## 🔗 Quick Links

- **🚀 Live App:** [Open App](https://trade-journal-4z6fpd1ij-patelaryan2106-5559s-projects.vercel.app)
- **📂 GitHub:** [View Code](https://github.com/Aryan1438/Trading_Journal)
- **📖 Documentation:** [Getting Started](QUICK_START.md)
- **🚀 Deploy Guide:** [Deployment](DEPLOYMENT.md)
- **🎨 Design System:** [UI Design](UI_DESIGN.md)

---

**⭐ Star this repo if you find it useful!**
