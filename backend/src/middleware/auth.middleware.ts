import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header is required' });
      return;
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      res.status(401).json({ error: 'Token is required' });
      return;
    }

    // Verify token and extract user ID
    const userId = await authService.verifyToken(token);
    req.userId = userId;

    next();
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Invalid token',
    });
  }
}

