// Reflection controller
// Handlers: createReflection, getReflections, updateReflection, deleteReflection

import Reflection from '../models/Reflection.js';

/**
 * Create a new reflection
 * POST /api/reflections
 */
export const createReflection = async (req, res) => {
  try {
    const { date, whatWentWell, mistakes, improvement, mood, emotionalBalance } = req.body;
    
    // Validate that at least one reflection field has content
    const hasContent = (whatWentWell && whatWentWell.trim()) || 
                       (mistakes && mistakes.trim()) || 
                       (improvement && improvement.trim());
    
    if (!hasContent) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one reflection field must have content'
      });
    }
    
    // Check if reflection already exists for this date
    const existingReflection = await Reflection.findOne({ 
      userId: req.user.userId, 
      date 
    });
    
    if (existingReflection) {
      // Update existing reflection
      existingReflection.whatWentWell = whatWentWell || '';
      existingReflection.mistakes = mistakes || '';
      existingReflection.improvement = improvement || '';
      existingReflection.mood = mood || 'neutral';
      existingReflection.emotionalBalance = emotionalBalance || 5;
      
      await existingReflection.save();
      
      return res.status(200).json({
        status: 'success',
        data: existingReflection
      });
    }
    
    // Create new reflection
    const reflection = await Reflection.create({
      userId: req.user.userId,
      date,
      whatWentWell: whatWentWell || '',
      mistakes: mistakes || '',
      improvement: improvement || '',
      mood: mood || 'neutral',
      emotionalBalance: emotionalBalance || 5
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

/**
 * Update a reflection
 * PUT /api/reflections/:id
 */
export const updateReflection = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, whatWentWell, mistakes, improvement, mood, emotionalBalance } = req.body;
    
    // Find reflection and verify ownership
    const reflection = await Reflection.findOne({ 
      _id: id, 
      userId: req.user.userId 
    });
    
    if (!reflection) {
      return res.status(404).json({
        status: 'error',
        message: 'Reflection not found'
      });
    }
    
    // Update fields
    if (date !== undefined) reflection.date = date;
    if (whatWentWell !== undefined) reflection.whatWentWell = whatWentWell;
    if (mistakes !== undefined) reflection.mistakes = mistakes;
    if (improvement !== undefined) reflection.improvement = improvement;
    if (mood !== undefined) reflection.mood = mood;
    if (emotionalBalance !== undefined) reflection.emotionalBalance = emotionalBalance;
    
    await reflection.save();
    
    res.status(200).json({
      status: 'success',
      data: reflection
    });
  } catch (error) {
    console.error('Update reflection error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Delete a reflection
 * DELETE /api/reflections/:id
 */
export const deleteReflection = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete reflection, verify ownership
    const reflection = await Reflection.findOneAndDelete({ 
      _id: id, 
      userId: req.user.userId 
    });
    
    if (!reflection) {
      return res.status(404).json({
        status: 'error',
        message: 'Reflection not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Reflection deleted successfully'
    });
  } catch (error) {
    console.error('Delete reflection error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
