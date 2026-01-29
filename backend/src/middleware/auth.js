// Authentication middleware
// JWT token verification and user authentication

import jwt from 'jsonwebtoken';

/**
 * Protect routes - verify JWT token
 * Add this middleware to any route that requires authentication
 */
export const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized - No token provided'
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId to request object for use in route handlers
    req.user = { userId: decoded.userId };

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized - Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized - Token expired'
      });
    }

    // Generic error
    res.status(401).json({
      status: 'error',
      message: 'Not authorized'
    });
  }
};
