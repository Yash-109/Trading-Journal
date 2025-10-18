# 📊 Sample Data for Testing

Copy this data to test import functionality or to see how the app looks with data.

## How to Use:

1. Copy the entire JSON below
2. Save as `sample-data.json` on your computer
3. Go to **Settings** → **Import Data**
4. Select the file
5. Refresh the page

---

## Sample JSON Data:

```json
{
  "trades": [
    {
      "id": "sample-1",
      "date": "2025-10-15",
      "pair": "XAUUSD",
      "direction": "Buy",
      "entry": 2650,
      "stopLoss": 2640,
      "takeProfit": 2670,
      "exit": 2668,
      "lotSize": 0.1,
      "profitLoss": 180,
      "rr": 2,
      "session": "London",
      "strategy": "Breakout",
      "ruleFollowed": true,
      "emotion": "Calm",
      "tradeQuality": 8,
      "screenshot": "",
      "notes": "Clean breakout above resistance. Waited for confirmation before entry. Took profit slightly early but maintained discipline."
    },
    {
      "id": "sample-2",
      "date": "2025-10-15",
      "pair": "BTCUSD",
      "direction": "Sell",
      "entry": 67500,
      "stopLoss": 68000,
      "takeProfit": 66500,
      "exit": 67200,
      "lotSize": 0.05,
      "profitLoss": 15,
      "rr": 2,
      "session": "New York",
      "strategy": "Supply/Demand",
      "ruleFollowed": true,
      "emotion": "Calm",
      "tradeQuality": 7,
      "screenshot": "",
      "notes": "Entered at supply zone. Price rejected nicely. Small profit but clean setup."
    },
    {
      "id": "sample-3",
      "date": "2025-10-16",
      "pair": "EURUSD",
      "direction": "Buy",
      "entry": 1.0850,
      "stopLoss": 1.0830,
      "takeProfit": 1.0890,
      "exit": 1.0825,
      "lotSize": 1.0,
      "profitLoss": -25,
      "rr": 2,
      "session": "London",
      "strategy": "Retest",
      "ruleFollowed": false,
      "emotion": "Overconfident",
      "tradeQuality": 4,
      "screenshot": "",
      "notes": "Entered too early without proper confirmation. Got stopped out. Need to wait for better confirmation signals. Violated 'wait for confirmation' rule."
    },
    {
      "id": "sample-4",
      "date": "2025-10-16",
      "pair": "XAUUSD",
      "direction": "Sell",
      "entry": 2655,
      "stopLoss": 2665,
      "takeProfit": 2635,
      "exit": 2636,
      "lotSize": 0.1,
      "profitLoss": 190,
      "rr": 2,
      "session": "New York",
      "strategy": "Smart Money",
      "ruleFollowed": true,
      "emotion": "Calm",
      "tradeQuality": 9,
      "screenshot": "",
      "notes": "Perfect SMC setup. Liquidity grab followed by bearish orderblock. Executed plan perfectly."
    },
    {
      "id": "sample-5",
      "date": "2025-10-17",
      "pair": "GBPUSD",
      "direction": "Sell",
      "entry": 1.3050,
      "stopLoss": 1.3070,
      "takeProfit": 1.3010,
      "exit": 1.3065,
      "lotSize": 0.5,
      "profitLoss": -7.5,
      "rr": 2,
      "session": "London",
      "strategy": "Breakout",
      "ruleFollowed": false,
      "emotion": "Revenge",
      "tradeQuality": 2,
      "screenshot": "",
      "notes": "REVENGE TRADE after previous loss. Didn't follow plan. Forced a trade that wasn't there. Big lesson: NEVER trade emotionally!"
    },
    {
      "id": "sample-6",
      "date": "2025-10-17",
      "pair": "US30",
      "direction": "Buy",
      "entry": 34500,
      "stopLoss": 34400,
      "takeProfit": 34700,
      "exit": 34650,
      "lotSize": 0.02,
      "profitLoss": 3,
      "rr": 2,
      "session": "New York",
      "strategy": "ICT",
      "ruleFollowed": true,
      "emotion": "Calm",
      "tradeQuality": 8,
      "screenshot": "",
      "notes": "Fair value gap fill. Good entry timing. Recovered from earlier loss with discipline."
    },
    {
      "id": "sample-7",
      "date": "2025-10-18",
      "pair": "XAUUSD",
      "direction": "Buy",
      "entry": 2648,
      "stopLoss": 2638,
      "takeProfit": 2668,
      "exit": 2667,
      "lotSize": 0.1,
      "profitLoss": 190,
      "rr": 2,
      "session": "Asia",
      "strategy": "Scalping",
      "ruleFollowed": true,
      "emotion": "Calm",
      "tradeQuality": 8,
      "screenshot": "",
      "notes": "Asia session scalp. Quick in and out. Following plan perfectly today."
    }
  ],
  "reflections": [
    {
      "date": "2025-10-15",
      "whatWentWell": "Followed my trading plan on both trades. Waited for proper confirmation signals. Maintained emotional control throughout the session.",
      "mistakes": "Could have let the XAUUSD trade run longer to TP. Sometimes I close too early out of fear.",
      "improvement": "Tomorrow I'll practice letting winners run to full TP. Need to trust my analysis more.",
      "mood": "good",
      "emotionalBalance": 8
    },
    {
      "date": "2025-10-16",
      "whatWentWell": "The XAUUSD sell was a perfect setup and execution. Recognized SMC principles clearly.",
      "mistakes": "EURUSD was a disaster. Entered without confirmation. Got overconfident after yesterday's wins. This cost me.",
      "improvement": "ALWAYS wait for confirmation. No exceptions. Overconfidence is my enemy. Stay humble.",
      "mood": "neutral",
      "emotionalBalance": 6
    },
    {
      "date": "2025-10-17",
      "whatWentWell": "Recovered emotionally with the US30 trade. Didn't let the revenge trade destroy my day.",
      "mistakes": "The GBPUSD revenge trade was completely unacceptable. Broke multiple rules. Traded from emotion not logic.",
      "improvement": "If I feel ANY emotion after a loss, I MUST take a 30-minute break. New rule added. This cannot happen again.",
      "mood": "bad",
      "emotionalBalance": 4
    },
    {
      "date": "2025-10-18",
      "whatWentWell": "Back to calm, disciplined trading. Clean execution. Following rules perfectly.",
      "mistakes": "None today. Executed the plan.",
      "improvement": "Keep this consistency going. This is the standard.",
      "mood": "great",
      "emotionalBalance": 9
    }
  ],
  "rules": [
    {
      "id": "rule-1",
      "text": "Never risk more than 2% of my account per trade",
      "active": true
    },
    {
      "id": "rule-2",
      "text": "Always wait for confirmation before entering a trade",
      "active": true
    },
    {
      "id": "rule-3",
      "text": "Set stop loss before entering any position",
      "active": true
    },
    {
      "id": "rule-4",
      "text": "Maximum 3 trades per day - quality over quantity",
      "active": true
    },
    {
      "id": "rule-5",
      "text": "Take a 30-minute break after any losing trade",
      "active": true
    },
    {
      "id": "rule-6",
      "text": "No trading during high-impact news unless planned",
      "active": true
    },
    {
      "id": "rule-7",
      "text": "Review all trades at end of each trading day",
      "active": true
    },
    {
      "id": "rule-8",
      "text": "Never revenge trade - emotions are the enemy",
      "active": true
    }
  ],
  "settings": {
    "theme": "dark",
    "defaultCurrency": "USD",
    "strategies": [
      "Breakout",
      "Retest",
      "Supply/Demand",
      "Smart Money",
      "ICT",
      "Scalping"
    ],
    "pairs": [
      "XAUUSD",
      "BTCUSD",
      "EURUSD",
      "GBPUSD",
      "US30",
      "NAS100"
    ]
  },
  "exportDate": "2025-10-18T12:00:00.000Z"
}
```

---

## What This Sample Data Includes:

### 📊 7 Sample Trades
- Mix of wins and losses
- Different pairs (XAUUSD, BTCUSD, EURUSD, GBPUSD, US30)
- Different strategies
- Different emotions
- Rule compliance variations
- Realistic notes

### 📝 4 Daily Reflections
- Honest self-assessment
- Mix of good and bad days
- Emotional journey
- Learning progression

### ✅ 8 Trading Rules
- Common best practices
- All active
- Ready to track compliance

### ⚙️ Settings
- 6 common pairs
- 6 popular strategies
- Dark theme
- USD currency

---

## Sample Data Insights:

When you import this data, you'll see:

**Dashboard:**
- 7 total trades
- Win rate: 57.1% (4 wins, 3 losses)
- Total P/L: +545.5 USD
- Current streak: 1 win
- Consistency: 71.4% (5/7 followed rules)

**Analytics:**
- XAUUSD: Best performing (3 trades, +560)
- GBPUSD: Worst performing (1 trade, -7.5)
- Revenge trades correlate with losses
- Calm emotion = highest win rate

**Patterns to Notice:**
- Overconfidence led to broken rules
- Revenge trading = losses
- Calm, disciplined trades = wins
- Following rules = better results

---

## How to Create Your Own Test Data:

1. Use the app normally
2. Export data (Settings → Export)
3. Edit the JSON file
4. Import back to test

---

**This sample data demonstrates realistic trading scenarios and helps you understand the app's full capabilities!**
