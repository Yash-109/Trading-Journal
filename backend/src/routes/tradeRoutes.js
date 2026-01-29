// Trade routes
// Routes: GET /trades, POST /trades, GET /trades/:id, PUT /trades/:id, DELETE /trades/:id

import express from 'express';
import { protect } from '../middleware/auth.js';
import { createTrade, getTrades } from '../controllers/tradeController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// GET /api/trades - Get all trades for authenticated user
router.get('/', getTrades);

// POST /api/trades - Create new trade
router.post('/', createTrade);

// Additional routes can be added here:
// GET /api/trades/:id
// PUT /api/trades/:id
// DELETE /api/trades/:id

export default router;
