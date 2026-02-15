# LOT SIZE ARCHITECTURE DOCUMENTATION
## Production-Grade Multi-Market Trading Journal

**Version:** 2.0.0  
**Date:** February 15, 2026  
**Author:** Senior Financial Systems Engineer

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Market Specifications](#market-specifications)
4. [File Structure](#file-structure)
5. [Implementation Details](#implementation-details)
6. [Usage Examples](#usage-examples)
7. [Maintenance & Updates](#maintenance--updates)
8. [Testing Strategy](#testing-strategy)

---

## Overview

This document describes the centralized, production-grade lot size architecture implemented for the Trading Journal application. The system handles multiple markets (Forex, Commodities, Crypto, Indian Markets) with consistent P&L calculations across all instrument types.

### Problem Statement
Previously, contract sizes and P&L calculations were:
- ❌ Hardcoded in multiple locations
- ❌ Duplicated across frontend and backend
- ❌ Inconsistent between components
- ❌ Difficult to maintain and update
- ❌ Prone to calculation errors

### Solution
A centralized, configuration-based system with:
- ✅ Single source of truth for contract specifications
- ✅ Reusable utility functions for P&L calculations
- ✅ Consistent logic across frontend and backend
- ✅ Easy to add new instruments
- ✅ Type-safe and well-documented

---

## Architecture Principles

### 1. **Single Source of Truth**
All contract specifications are defined in one centralized configuration file:
- Backend: `backend/config/contractSpecs.js`
- Frontend: `frontend/src/utils/contractUtils.js`

### 2. **Configuration Over Code**
Instrument definitions are data, not logic:
```javascript
NIFTY: {
  symbol: 'NIFTY',
  contractSize: 50,
  lotType: LOT_TYPES.FLEXIBLE,
  minLotSize: 1,
  lotIncrement: 1,
  // ... more metadata
}
```

### 3. **Market-Agnostic Interface**
Unified API for all markets:
```javascript
calculatePnL({
  market: 'FOREX',
  symbol: 'EURUSD',
  entryPrice: 1.1000,
  exitPrice: 1.1050,
  lotSize: 0.1,
  direction: 'Buy'
})
```

### 4. **Separation of Concerns**
- **Contract Specs** → Define instrument properties
- **P&L Calculator** → Handle calculations
- **Controllers** → Orchestrate business logic
- **Components** → Display and collect data

---

## Market Specifications

### FOREX (OTC Standard)
| Pair | Contract Size | Lot Type | Min Lot | Increment |
|------|--------------|----------|---------|-----------|
| EURUSD | 100,000 units | FIXED | 0.01 | 0.01 |
| GBPUSD | 100,000 units | FIXED | 0.01 | 0.01 |
| USDJPY | 100,000 units | FIXED | 0.01 | 0.01 |
| AUDUSD | 100,000 units | FIXED | 0.01 | 0.01 |
| USDCAD | 100,000 units | FIXED | 0.01 | 0.01 |

**Lot Types:**
- Standard Lot = 1.00 (100,000 units)
- Mini Lot = 0.10 (10,000 units)
- Micro Lot = 0.01 (1,000 units)

**P&L Formula:**
```
P&L = (Exit - Entry) × 100,000 × LotSize × Direction
```

**Example:**
- Buy 0.1 lots EURUSD at 1.1000, exit at 1.1050
- P&L = (1.1050 - 1.1000) × 100,000 × 0.1 = **$50**

---

### COMMODITY (CFD Style)
| Symbol | Contract Size | Unit | Point Value |
|--------|--------------|------|-------------|
| XAUUSD | 100 | troy oz | $100 per $1 move |

**P&L Formula:**
```
P&L = (Exit - Entry) × 100 × LotSize × Direction
```

**Example:**
- Buy 0.1 lots XAUUSD at $1800, exit at $1810
- P&L = ($1810 - $1800) × 100 × 0.1 = **$100**

---

### CRYPTO (CFD Assumption)
| Pair | Contract Size | Lot Type | Min Lot |
|------|--------------|----------|---------|
| BTCUSD | 1 BTC | FIXED | 0.01 |
| ETHUSD | 1 ETH | FIXED | 0.01 |

**P&L Formula:**
```
P&L = (Exit - Entry) × 1 × LotSize × Direction
```

**Example:**
- Buy 0.1 lots BTCUSD at $50,000, exit at $51,000
- P&L = ($51,000 - $50,000) × 1 × 0.1 = **$100**

---

### INDIAN F&O (NSE Defined)
| Symbol | Contract Size | Exchange | Point Value |
|--------|--------------|----------|-------------|
| NIFTY | 50 units | NSE | ₹50 per point |
| BANKNIFTY | 15 units | NSE | ₹15 per point |
| FINNIFTY | 40 units | NSE | ₹40 per point |
| MIDCPNIFTY | 75 units | NSE | ₹75 per point |

**Lot Type:** FLEXIBLE (whole numbers only)

**P&L Formula:**
```
P&L = (Exit - Entry) × ContractSize × Lots × Direction
```

**Example:**
- Buy 2 lots NIFTY at 18,000, exit at 18,100
- P&L = (18,100 - 18,000) × 50 × 2 = **₹10,000**

---

### INDIAN CASH EQUITY
**Lot Type:** NONE (quantity-based)

**P&L Formula:**
```
P&L = (Exit - Entry) × Quantity × Direction
```

**Example:**
- Buy 100 shares of RELIANCE at ₹2,500, exit at ₹2,550
- P&L = (₹2,550 - ₹2,500) × 100 = **₹5,000**

---

## File Structure

### Backend Files

#### 1. `backend/config/contractSpecs.js`
**Purpose:** Centralized contract specification registry

**Key Exports:**
- `MARKET_TYPES` - Enum of supported markets
- `LOT_TYPES` - Enum of lot type classifications
- `CONTRACT_SPECS` - Master registry of all instruments
- `getContractSpec()` - Get full specification for an instrument
- `getContractSize()` - Get contract size for an instrument
- `getPositionSize()` - Calculate total position size
- `validateLotSize()` - Validate lot size inputs
- `getLotFieldLabel()` - Get UI label for lot/quantity field
- `isLotBased()` - Check if instrument uses lots

**Usage:**
```javascript
import { getContractSpec, getContractSize } from '../config/contractSpecs.js';

const spec = getContractSpec({ 
  market: 'FOREX', 
  symbol: 'EURUSD' 
});
// Returns: { contractSize: 100000, lotType: 'FIXED', ... }

const size = getContractSize({ 
  market: 'FOREX', 
  symbol: 'EURUSD' 
});
// Returns: 100000
```

---

#### 2. `backend/utils/pnlCalculator.js`
**Purpose:** Centralized P&L calculation engine

**Key Exports:**
- `calculatePnL()` - Calculate profit/loss for a trade
- `calculateRiskReward()` - Calculate R:R ratio
- `calculateRiskAmount()` - Calculate risk in currency
- `calculateRewardAmount()` - Calculate reward in currency
- `calculatePositionValue()` - Calculate position notional value
- `calculateTradeMetrics()` - Batch calculate all metrics
- `validateTradeParams()` - Validate trade parameters
- `formatPnL()` - Format P&L for display

**P&L Algorithm:**
```javascript
// Direction multiplier
const directionMultiplier = (direction === 'Buy') ? 1 : -1;

// Price difference
const priceDiff = (exit - entry) * directionMultiplier;

// P&L calculation
if (lotType === 'NONE') {
  // Quantity-based (Indian equity)
  pnl = priceDiff × quantity;
} else {
  // Lot-based (all other markets)
  pnl = priceDiff × contractSize × lotSize;
}
```

**Usage:**
```javascript
import { calculatePnL, calculateRiskReward } from '../utils/pnlCalculator.js';

const pnl = calculatePnL({
  market: 'FOREX',
  symbol: 'EURUSD',
  entryPrice: 1.1000,
  exitPrice: 1.1050,
  lotSize: 0.1,
  direction: 'Buy'
});
// Returns: 50 ($50 profit)

const rr = calculateRiskReward({
  entryPrice: 1.1000,
  stopLoss: 1.0950,
  takeProfit: 1.1100,
  direction: 'Buy'
});
// Returns: 2 (1:2 R:R)
```

---

#### 3. `backend/src/controllers/tradeController.js`
**Purpose:** Trade business logic and API handlers

**Key Changes:**
- Replaced inline P&L calculations with `calculatePnL()`
- Replaced inline R:R calculations with `calculateRiskReward()`
- Uses `getPositionSize()` for Indian F&O quantity calculation
- No more hardcoded contract sizes or formulas

**Before:**
```javascript
// ❌ Hardcoded logic
if (market === 'FOREX') {
  const contractSize = 100000;
  if (direction === 'Buy') {
    pnl = (exitPrice - entryPrice) * contractSize * lot;
  } else {
    pnl = (entryPrice - exitPrice) * contractSize * lot;
  }
}
```

**After:**
```javascript
// ✅ Centralized utility
const pnl = calculatePnL({
  market,
  symbol: symbol || pair,
  instrumentType,
  entryPrice: entry,
  exitPrice: exit,
  lotSize: effectiveLotSize,
  direction
});
```

---

#### 4. `backend/config/indianMarket.js`
**Purpose:** Legacy file for backward compatibility

**Status:** ⚠️ DEPRECATED - Use `contractSpecs.js` instead

**Key Changes:**
- Updated lot sizes to correct NSE specifications
- Redirects `getContractSize()` to new centralized function
- Marked with deprecation warnings

---

### Frontend Files

#### 1. `frontend/src/utils/contractUtils.js`
**Purpose:** Frontend mirror of backend contract specs

**Why Separate:**
- Avoids importing backend code into frontend
- Optimized for browser bundle size
- Includes UI-specific helpers

**Key Exports:**
- All the same functions as backend `contractSpecs.js`
- Plus: `getContractInfo()` - Get human-readable contract info
- Plus: `getIndianFnoLotSize()` - Quick lookup for Indian F&O

**Usage:**
```javascript
import { calculatePnL, getContractInfo } from '../utils/contractUtils';

// Calculate P&L on the client side
const pnl = calculatePnL({
  market: formData.market,
  symbol: formData.pair,
  entryPrice: formData.entry,
  exitPrice: formData.exit,
  lotSize: formData.lotSize,
  direction: formData.direction
});

// Get display info
const info = getContractInfo({ 
  market: 'FOREX', 
  symbol: 'EURUSD' 
});
// Returns: "1 lot = 100,000 units"
```

---

#### 2. `frontend/src/components/TradeModal.jsx`
**Purpose:** Trade input modal component

**Key Changes:**
- Removed hardcoded `CONTRACT_SIZES` object
- Uses `calculatePnL()` and `calculateRiskReward()` in useEffect
- Uses `getContractInfo()` for displaying contract specs
- Updated all Indian F&O lot sizes to correct values (50, 15, 40, 75)
- Dynamic P&L calculation as user types

**Before:**
```javascript
// ❌ Hardcoded lot sizes
const lotSizes = {
  NIFTY: 25,  // WRONG!
  BANKNIFTY: 15,
  FINNIFTY: 25,  // WRONG!
  MIDCPNIFTY: 50,  // WRONG!
};
```

**After:**
```javascript
// ✅ Uses centralized utilities
const pnl = calculatePnL({
  market: formData.market,
  symbol: effectiveSymbol,
  instrumentType: formData.instrumentType,
  entryPrice: formData.entry,
  exitPrice: formData.exit,
  lotSize: effectiveLotSize,
  direction: formData.direction
});
```

---

## Implementation Details

### Direction Multiplier Logic

Both Buy and Sell trades use a consistent formula:

```javascript
const directionMultiplier = (direction === 'Buy') ? 1 : -1;
const priceDiff = (exitPrice - entryPrice) * directionMultiplier;
```

**Buy Trade:**
- Exit > Entry → Positive P&L (profit)
- Exit < Entry → Negative P&L (loss)

**Sell Trade:**
- Entry > Exit → Positive P&L (profit)
- Entry < Exit → Negative P&L (loss)

### Lot Size Validation

Different markets have different validation rules:

**FOREX/COMMODITY/CRYPTO:**
- Minimum: 0.01 lots
- Increment: 0.01 lots
- Allows decimals (e.g., 0.1, 0.25, 1.5)

**INDIAN F&O:**
- Minimum: 1 lot
- Increment: 1 lot
- Whole numbers only (no decimals)

**INDIAN EQUITY:**
- No lot system
- Quantity-based
- Whole numbers only

### Position Size Calculation

```javascript
// Lot-based markets
positionSize = contractSize × lotSize

// Examples:
// FOREX: 100,000 × 0.1 = 10,000 units
// NIFTY: 50 × 2 = 100 units
// BTCUSD: 1 × 0.5 = 0.5 BTC

// Quantity-based markets (Indian equity)
positionSize = quantity  // Direct, no multiplication
```

---

## Usage Examples

### Example 1: Forex Trade (Backend)

```javascript
// In tradeController.js
const pnl = calculatePnL({
  market: 'FOREX',
  symbol: 'EURUSD',
  entryPrice: 1.1000,
  exitPrice: 1.1050,
  lotSize: 0.1,
  direction: 'Buy'
});
// Result: $50 profit

const rr = calculateRiskReward({
  entryPrice: 1.1000,
  stopLoss: 1.0950,
  takeProfit: 1.1150,
  direction: 'Buy'
});
// Result: 3 (1:3 risk:reward)
```

### Example 2: Indian F&O Trade (Backend)

```javascript
const pnl = calculatePnL({
  market: 'INDIAN',
  symbol: 'NIFTY',
  instrumentType: 'INDEX',
  entryPrice: 18000,
  exitPrice: 18100,
  lotSize: 2,  // 2 lots
  direction: 'Buy'
});
// Result: ₹10,000 profit
// Calculation: (18100 - 18000) × 50 × 2 = 10,000
```

### Example 3: Adding New Instrument

To add a new forex pair (e.g., NZDUSD):

**Backend: `contractSpecs.js`**
```javascript
const FOREX_SPECS = {
  // ... existing pairs
  NZDUSD: {
    symbol: 'NZDUSD',
    name: 'New Zealand Dollar / US Dollar',
    contractSize: 100000,
    lotType: LOT_TYPES.FIXED,
    minLotSize: 0.01,
    lotIncrement: 0.01,
    baseCurrency: 'NZD',
    quoteCurrency: 'USD',
    pipValue: 10,
    marketType: MARKET_TYPES.FOREX
  }
};
```

**Frontend: `contractUtils.js`**
```javascript
FOREX: {
  // ... existing pairs
  NZDUSD: { 
    contractSize: 100000, 
    lotType: LOT_TYPES.FIXED, 
    minLotSize: 0.01, 
    lotIncrement: 0.01 
  },
}
```

**Frontend: `TradeModal.jsx`**
```jsx
{formData.market === 'FOREX' && (
  <select name="pair" value={formData.pair} onChange={handleChange}>
    <option value="">Select pair...</option>
    <option value="EURUSD">EURUSD</option>
    <option value="GBPUSD">GBPUSD</option>
    {/* ... other pairs */}
    <option value="NZDUSD">NZDUSD</option>  {/* Add here */}
  </select>
)}
```

That's it! The P&L calculation will automatically work with the new pair.

### Example 4: Updating NSE Lot Sizes

When NSE changes lot sizes (they do this periodically):

**1. Update Backend:** `contractSpecs.js`
```javascript
const INDIAN_FNO_SPECS = {
  NIFTY: {
    symbol: 'NIFTY',
    contractSize: 75,  // Changed from 50 to 75
    // ... rest stays same
  }
};
```

**2. Update Frontend:** `contractUtils.js`
```javascript
INDIAN_FNO: {
  NIFTY: { 
    contractSize: 75,  // Changed from 50 to 75
    // ... rest stays same
  }
}
```

**3. Update UI Labels:** `TradeModal.jsx`
```jsx
<option value="NIFTY">NIFTY (Lot: 75)</option>  {/* Changed from 50 */}

{formData.symbol === 'NIFTY' && 'Lot size: 75 units | ₹75 per point'}
```

All P&L calculations will automatically use the new lot size.

---

## Maintenance & Updates

### When to Update

**1. Exchange Changes Lot Sizes**
- NSE, BSE update lot sizes for Indian F&O
- Update `contractSpecs.js` and `contractUtils.js`

**2. Adding New Instruments**
- New forex pairs, commodities, cryptos
- Add to appropriate market section in specs files

**3. New Market Types**
- If adding entirely new market (e.g., Options, Stocks)
- Add new market type to `MARKET_TYPES`
- Define contract specs structure
- Update P&L calculator if needed

### Update Checklist

When modifying contract specifications:

- [ ] Update backend `contractSpecs.js`
- [ ] Update frontend `contractUtils.js`
- [ ] Update UI dropdowns in `TradeModal.jsx`
- [ ] Update display labels and info text
- [ ] Test P&L calculations
- [ ] Update this documentation
- [ ] Notify users of changes (if applicable)

### Version Control

Track changes to contract specifications:

```javascript
/**
 * INDIAN F&O Market Specifications
 * Official NSE lot sizes for Index Futures & Options
 * 
 * Source: NSE India official specifications
 * Last verified: February 2026
 * 
 * Version History:
 * - v2.0.0 (Feb 2026): Updated NIFTY 25→50, FINNIFTY 25→40, MIDCPNIFTY 50→75
 * - v1.0.0 (Jan 2025): Initial specifications
 */
```

---

## Testing Strategy

### Unit Tests

**Backend P&L Calculator:**
```javascript
describe('calculatePnL', () => {
  it('calculates Forex Buy trade correctly', () => {
    const result = calculatePnL({
      market: 'FOREX',
      symbol: 'EURUSD',
      entryPrice: 1.1000,
      exitPrice: 1.1050,
      lotSize: 0.1,
      direction: 'Buy'
    });
    expect(result).toBe(50);
  });

  it('calculates Forex Sell trade correctly', () => {
    const result = calculatePnL({
      market: 'FOREX',
      symbol: 'EURUSD',
      entryPrice: 1.1050,
      exitPrice: 1.1000,
      lotSize: 0.1,
      direction: 'Sell'
    });
    expect(result).toBe(50);
  });

  it('calculates Indian F&O trade correctly', () => {
    const result = calculatePnL({
      market: 'INDIAN',
      symbol: 'NIFTY',
      instrumentType: 'INDEX',
      entryPrice: 18000,
      exitPrice: 18100,
      lotSize: 2,
      direction: 'Buy'
    });
    expect(result).toBe(10000);
  });
});
```

### Integration Tests

**Full Trade Flow:**
1. Create trade via API
2. Verify P&L calculated correctly
3. Update trade prices
4. Verify P&L recalculated
5. Verify currency conversion applied

### Manual Test Cases

| Market | Symbol | Entry | Exit | Lots | Direction | Expected P&L |
|--------|--------|-------|------|------|-----------|--------------|
| FOREX | EURUSD | 1.1000 | 1.1050 | 0.1 | Buy | $50 |
| FOREX | EURUSD | 1.1050 | 1.1000 | 0.1 | Sell | $50 |
| COMMODITY | XAUUSD | 1800 | 1810 | 0.1 | Buy | $100 |
| CRYPTO | BTCUSD | 50000 | 51000 | 0.1 | Buy | $100 |
| INDIAN | NIFTY | 18000 | 18100 | 2 | Buy | ₹10000 |
| INDIAN | BANKNIFTY | 42000 | 42100 | 3 | Buy | ₹4500 |

---

## Best Practices

### DO ✅

1. **Use the centralized utilities everywhere**
   ```javascript
   import { calculatePnL } from '../utils/pnlCalculator.js';
   const pnl = calculatePnL(params);
   ```

2. **Keep contract specs in sync**
   - Backend and frontend should match
   - Document version history
   - Track NSE/exchange updates

3. **Validate inputs**
   ```javascript
   import { validateLotSize } from '../config/contractSpecs.js';
   const validation = validateLotSize(params);
   if (!validation.valid) {
     return error(validation.message);
   }
   ```

4. **Use proper types**
   - Numbers for prices and lot sizes
   - Strings for market types and symbols
   - Enums for direction ('Buy'/'Sell')

### DON'T ❌

1. **Never hardcode contract sizes**
   ```javascript
   // ❌ DON'T DO THIS
   const contractSize = 100000;
   
   // ✅ DO THIS
   const contractSize = getContractSize({ market, symbol });
   ```

2. **Never duplicate P&L logic**
   ```javascript
   // ❌ DON'T DO THIS
   if (direction === 'Buy') {
     pnl = (exit - entry) * 100000 * lot;
   }
   
   // ✅ DO THIS
   const pnl = calculatePnL(params);
   ```

3. **Never skip validation**
   - Always validate lot sizes
   - Always validate prices
   - Always check for required fields

4. **Never use magic numbers**
   ```javascript
   // ❌ DON'T DO THIS
   const qty = lots * 50;  // What is 50?
   
   // ✅ DO THIS
   const qty = getPositionSize({ market, symbol, instrumentType, lotSize: lots });
   ```

---

## Future Enhancements

### Planned Features

1. **Dynamic Contract Spec Loading**
   - Fetch from external API
   - Real-time updates from exchanges
   - Automatic sync across instances

2. **Historical Contract Specs**
   - Track lot size changes over time
   - Recalculate historical P&L with correct specs
   - Audit trail for compliance

3. **Advanced Validation**
   - Market hours validation
   - Leverage limits
   - Margin requirements
   - Position size limits

4. **Multi-Currency Support**
   - Automatic currency conversion
   - Cross-currency pairs
   - Display P&L in multiple currencies

5. **Performance Monitoring**
   - Track calculation speed
   - Cache contract specs
   - Optimize for large datasets

---

## Troubleshooting

### P&L Calculation Incorrect

**Check:**
1. Contract size matches exchange specification
2. Lot size/quantity input is correct
3. Direction (Buy/Sell) is correct
4. Entry and exit prices are valid numbers
5. Market type and instrument type are set correctly

### New Instrument Not Working

**Check:**
1. Added to `CONTRACT_SPECS` in backend
2. Added to `CONTRACT_SPECS` in frontend
3. Added to UI dropdown options
4. Spelling matches exactly (case-sensitive)
5. Contract size is correct

### Indian F&O Calculation Wrong

**Common Issue:** Using old lot sizes

**Solution:**
- NIFTY: 50 (not 25)
- FINNIFTY: 40 (not 25)
- MIDCPNIFTY: 75 (not 50)
- Verify with latest NSE circular

---

## References

### Exchange Documentation

1. **NSE India** - https://www.nseindia.com/
   - Futures & Options specifications
   - Lot size circulars
   - Contract specifications

2. **BSE India** - https://www.bseindia.com/
   - SENSEX F&O specifications

3. **Standard Forex Specifications**
   - Industry standard: 1 lot = 100,000 units
   - Mini lot = 10,000 units
   - Micro lot = 1,000 units

### Internal Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall system architecture
- [INDIAN_MARKETS_IMPLEMENTATION.md](./INDIAN_MARKETS_IMPLEMENTATION.md) - Indian market details
- [CURRENCY_CONVERSION_FIX.md](./CURRENCY_CONVERSION_FIX.md) - Currency handling

---

## Summary

This lot size architecture provides:

✅ **Centralized Configuration** - Single source of truth  
✅ **Type Safety** - Well-defined interfaces  
✅ **Maintainability** - Easy to update and extend  
✅ **Consistency** - Same logic everywhere  
✅ **Scalability** - Easy to add new markets/instruments  
✅ **Testability** - Isolated, testable units  
✅ **Documentation** - Clear, comprehensive docs  

The system is production-ready and follows industry best practices for financial trading applications.

---

**Questions or Issues?**  
Contact: Senior Financial Systems Engineer  
Last Updated: February 15, 2026
