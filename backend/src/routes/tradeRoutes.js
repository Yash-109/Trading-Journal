// Trade routes
// Routes: GET /trades, POST /trades, GET /trades/:id, PUT /trades/:id, DELETE /trades/:id

import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createTrade, 
  getTrades, 
  getTradeById, 
  updateTrade, 
  deleteTrade 
} from '../controllers/tradeController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// GET /api/trades - Get all trades for authenticated user
router.get('/', getTrades);

// POST /api/trades - Create new trade
router.post('/', createTrade);

// GET /api/trades/:id - Get single trade by ID
router.get('/:id', getTradeById);

// PUT /api/trades/:id - Update trade
router.put('/:id', updateTrade);

// DELETE /api/trades/:id - Delete trade
router.delete('/:id', deleteTrade);

export default router;
