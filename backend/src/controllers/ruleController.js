// Rule controller
// Handlers: createRule, getRules, updateRule, deleteRule

import Rule from '../models/Rule.js';

/**
 * Create a new rule
 * POST /api/rules
 */
export const createRule = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Create rule with userId from auth middleware
    const rule = await Rule.create({
      userId: req.user.userId,
      title,
      description
    });
    
    res.status(201).json({
      status: 'success',
      data: rule
    });
  } catch (error) {
    console.error('Create rule error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all rules for authenticated user
 * GET /api/rules
 */
export const getRules = async (req, res) => {
  try {
    // Filter rules by userId from auth middleware
    const rules = await Rule.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: rules
    });
  } catch (error) {
    console.error('Get rules error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
