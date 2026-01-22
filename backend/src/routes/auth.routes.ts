import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', asyncHandler(register));

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', asyncHandler(login));

export default router;

