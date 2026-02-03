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

  // Ollama health check endpoint
  app.get('/health/ollama', async (req, res) => {
    try {
      const { OllamaService } = await import('./services/ollama.service');
      const ollamaService = new OllamaService();
      const isHealthy = await ollamaService.healthCheck();
      const modelAvailable = await ollamaService.verifyModel();
      
      res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'ok' : 'unavailable',
        ollama: {
          healthy: isHealthy,
          model: process.env.OLLAMA_MODEL || 'qwen2.5:1.5b',
          modelAvailable: modelAvailable,
          baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
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

