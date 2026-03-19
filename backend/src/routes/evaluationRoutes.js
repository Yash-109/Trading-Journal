/**
 * Evaluation Routes
 * REST API routes for trade and session evaluation
 */

import express from 'express';
import {
  evaluateTradeEndpoint,
  evaluateSessionEndpoint,
} from '../controllers/evaluationController.js';

const router = express.Router();

// POST /api/evaluate/trade
router.post('/trade', evaluateTradeEndpoint);

// POST /api/evaluate/session
router.post('/session', evaluateSessionEndpoint);

export default router;
