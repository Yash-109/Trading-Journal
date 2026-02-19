// Exchange Rate routes
// Routes: GET /api/exchange-rate/current

import express from 'express';
import { protect } from '../middleware/auth.js';
import { getTodayUsdInrRate } from '../services/exchangeRateService.js';

const router = express.Router();

/**
 * GET /api/exchange-rate/current
 * Get current USD→INR exchange rate
 */
router.get('/current', protect, async (req, res) => {
  try {
    const rate = await getTodayUsdInrRate();
    
    res.status(200).json({
      status: 'success',
      data: {
        USD_INR: rate,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get exchange rate error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch exchange rate',
    });
  }
});

export default router;

