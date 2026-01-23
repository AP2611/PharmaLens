import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import prescriptionRoutes from './routes/prescription.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

/**
 * Creates and configures Express application
 */
export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Serve uploaded files (for development)
  if (process.env.NODE_ENV === 'development') {
    const path = require('path');
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/auth', authRoutes);
  app.use('/prescription', prescriptionRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Route not found',
      path: req.path,
    });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

