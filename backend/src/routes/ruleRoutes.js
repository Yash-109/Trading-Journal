// Rule routes
// Routes: GET /rules, POST /rules, PUT /rules/:id, DELETE /rules/:id

import express from 'express';
import { protect } from '../middleware/auth.js';
import { createRule, getRules } from '../controllers/ruleController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// GET /api/rules - Get all rules for authenticated user
router.get('/', getRules);

// POST /api/rules - Create new rule
router.post('/', createRule);

// Additional routes can be added here:
// PUT /api/rules/:id
// DELETE /api/rules/:id

export default router;
