// Reflection routes
// Routes: GET /reflections, POST /reflections, PUT /reflections/:id, DELETE /reflections/:id

import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createReflection, 
  getReflections, 
  updateReflection, 
  deleteReflection 
} from '../controllers/reflectionController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// GET /api/reflections - Get all reflections for authenticated user
router.get('/', getReflections);

// POST /api/reflections - Create new reflection
router.post('/', createReflection);

// PUT /api/reflections/:id - Update a reflection
router.put('/:id', updateReflection);

// DELETE /api/reflections/:id - Delete a reflection
router.delete('/:id', deleteReflection);

export default router;
