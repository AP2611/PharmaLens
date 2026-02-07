import { Request, Response } from 'express';
import { AuthService, RegisterInput, LoginInput } from '../services/auth.service';
import { z } from 'zod';

const authService = new AuthService();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Register a new user
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    // Validate input
    const validatedInput = registerSchema.parse(req.body) as RegisterInput;

    // Register user
    const result = await authService.register(validatedInput);

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
        return;
      }
    }

    throw error;
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    // Validate input
    const validatedInput = loginSchema.parse(req.body) as LoginInput;

    // Login user
    const result = await authService.login(validatedInput);

    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    if (error instanceof Error) {
      if (error.message.includes('Invalid')) {
        res.status(401).json({ error: error.message });
        return;
      }
    }

    throw error;
  }
}

