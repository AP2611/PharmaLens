import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// All profile routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/', asyncHandler(getProfile));

/**
 * @route   PUT /profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', asyncHandler(updateProfile));

export default router;
