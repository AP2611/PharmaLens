import { Request, Response } from 'express';
import { PrescriptionService, CreatePrescriptionInput } from '../services/prescription.service';
import { extractTextFromImage, extractTextFromImageFallback } from '../utils/imageProcessor';
import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';

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
 * Upload and analyze prescription image
 */
export async function uploadAndAnalyzePrescription(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const imagePath = req.file.path;
    let extractedText: string;

    try {
      // Try to extract text using vision model
      extractedText = await extractTextFromImage(imagePath);
    } catch (error) {
      // Fallback: try alternative method or return error
      try {
        extractedText = await extractTextFromImageFallback(imagePath);
      } catch (fallbackError) {
        // Clean up uploaded file
        await fs.unlink(imagePath).catch(() => {});
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to extract text from image';
        res.status(503).json({ 
          error: errorMessage,
          suggestion: 'Please install a vision model: ollama pull llava:latest, or use manual entry instead.'
        });
        return;
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      // Clean up uploaded file
      await fs.unlink(imagePath).catch(() => {});
      res.status(400).json({ error: 'Could not extract text from image. Please try manual entry.' });
      return;
    }

    // Analyze the extracted text
    const input: CreatePrescriptionInput = {
      rawText: extractedText,
      uploadedImagePath: path.relative(process.cwd(), imagePath),
    };

    const result = await prescriptionService.analyzePrescription(req.userId, input);

    res.status(200).json({
      message: 'Prescription image analyzed successfully',
      data: {
        ...result,
        extractedText: extractedText, // Include extracted text in response
      },
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
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

