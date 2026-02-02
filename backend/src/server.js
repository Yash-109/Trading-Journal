// Main server entry point
// Express app setup, middleware configuration, route mounting, and server startup

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Import required packages
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Import route modules (placeholders for now)
import authRoutes from './routes/authRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import ruleRoutes from './routes/ruleRoutes.js';
import reflectionRoutes from './routes/reflectionRoutes.js';
import evaluationRoutes from '../routes/evaluationRoutes.js';

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Connect to MongoDB
connectDB();

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Trading Journal API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/evaluate', evaluationRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
