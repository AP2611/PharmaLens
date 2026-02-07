import { Request, Response } from 'express';
import { ProfileService, UpdateProfileInput } from '../services/profile.service';
import { z } from 'zod';

const profileService = new ProfileService();

// Validation schema for profile update
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

/**
 * Get user profile
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const profile = await profileService.getProfile(userId);

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: profile,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message });
        return;
      }
    }
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate input
    const validatedInput = updateProfileSchema.parse(req.body) as UpdateProfileInput;

    // Update profile
    const profile = await profileService.updateProfile(userId, validatedInput);

    res.status(200).json({
      message: 'Profile updated successfully',
      data: profile,
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
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message });
        return;
      }
    }

    throw error;
  }
}
