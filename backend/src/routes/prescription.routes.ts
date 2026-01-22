import { Router } from 'express';
import { analyzePrescription, getPrescriptionHistory } from '../controllers/prescription.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// All prescription routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /prescription/analyze
 * @desc    Analyze a prescription
 * @access  Private
 */
router.post('/analyze', asyncHandler(analyzePrescription));

/**
 * @route   GET /prescription/history
 * @desc    Get prescription history for authenticated user
 * @access  Private
 */
router.get('/history', asyncHandler(getPrescriptionHistory));

export default router;

