// Reflection controller
// Handlers: createReflection, getReflections, updateReflection, deleteReflection

import Reflection from '../models/Reflection.js';

/**
 * Create a new reflection
 * POST /api/reflections
 */
export const createReflection = async (req, res) => {
  try {
    const { date, content, mood } = req.body;
    
    // Create reflection with userId from auth middleware
    const reflection = await Reflection.create({
      userId: req.user.userId,
      date,
      content,
      mood
    });
    
    res.status(201).json({
      status: 'success',
      data: reflection
    });
  } catch (error) {
    console.error('Create reflection error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all reflections for authenticated user
 * GET /api/reflections
 */
export const getReflections = async (req, res) => {
  try {
    // Filter reflections by userId from auth middleware
    const reflections = await Reflection.find({ userId: req.user.userId }).sort({ date: -1 });
    
    res.status(200).json({
      status: 'success',
      data: reflections
    });
  } catch (error) {
    console.error('Get reflections error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
