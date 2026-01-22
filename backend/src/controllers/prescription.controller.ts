import { Request, Response } from 'express';
import { PrescriptionService, CreatePrescriptionInput } from '../services/prescription.service';
import { z } from 'zod';

const prescriptionService = new PrescriptionService();

// Validation schema
const analyzePrescriptionSchema = z.object({
  rawText: z.string().min(1, 'Prescription text is required'),
  uploadedImagePath: z.string().optional(),
});

/**
 * Analyze a prescription
 */
export async function analyzePrescription(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate input
    const validatedInput = analyzePrescriptionSchema.parse(req.body) as CreatePrescriptionInput;

    // Analyze prescription
    const result = await prescriptionService.analyzePrescription(req.userId, validatedInput);

    res.status(200).json({
      message: 'Prescription analyzed successfully',
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
      if (error.message.includes('Failed to analyze')) {
        res.status(503).json({ error: error.message });
        return;
      }
      if (error.message.includes('required')) {
        res.status(400).json({ error: error.message });
        return;
      }
    }

    throw error;
  }
}

/**
 * Get prescription history
 */
export async function getPrescriptionHistory(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get prescription history
    const history = await prescriptionService.getPrescriptionHistory(req.userId);

    res.status(200).json({
      message: 'Prescription history retrieved successfully',
      data: history,
    });
  } catch (error) {
    throw error;
  }
}

