// Reflection routes
// Routes: GET /reflections, POST /reflections, PUT /reflections/:date, DELETE /reflections/:date

import express from 'express';
import { protect } from '../middleware/auth.js';
import { createReflection, getReflections } from '../controllers/reflectionController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// GET /api/reflections - Get all reflections for authenticated user
router.get('/', getReflections);

// POST /api/reflections - Create new reflection
router.post('/', createReflection);

// Additional routes can be added here:
// PUT /api/reflections/:date
// DELETE /api/reflections/:date

export default router;
