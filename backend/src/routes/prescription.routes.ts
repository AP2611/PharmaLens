import { Router } from 'express';
import { analyzePrescription, uploadAndAnalyzePrescription, getPrescriptionHistory } from '../controllers/prescription.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = Router();

// All prescription routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /prescription/analyze
 * @desc    Analyze a prescription from text
 * @access  Private
 */
router.post('/analyze', asyncHandler(analyzePrescription));

/**
 * @route   POST /prescription/upload
 * @desc    Upload and analyze a prescription image
 * @access  Private
 */
router.post('/upload', uploadSingle, asyncHandler(uploadAndAnalyzePrescription));

/**
 * @route   GET /prescription/history
 * @desc    Get prescription history for authenticated user
 * @access  Private
 */
router.get('/history', asyncHandler(getPrescriptionHistory));

export default router;

