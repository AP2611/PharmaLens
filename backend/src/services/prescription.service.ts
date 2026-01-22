import { prisma } from '../lib/prisma';
import { OllamaService } from './ollama.service';

const ollamaService = new OllamaService();

export interface CreatePrescriptionInput {
  rawText: string;
  uploadedImagePath?: string;
}

export interface PrescriptionWithAnalysis {
  id: string;
  rawText: string;
  uploadedImagePath: string | null;
  createdAt: Date;
  analysis: any;
}

/**
 * Service for prescription operations
 */
export class PrescriptionService {
  /**
   * Analyzes a prescription and stores it in the database
   */
  async analyzePrescription(
    userId: string,
    input: CreatePrescriptionInput
  ): Promise<PrescriptionWithAnalysis> {
    // Validate input
    if (!input.rawText || input.rawText.trim().length === 0) {
      throw new Error('Prescription text is required');
    }

    // Analyze prescription using Ollama
    let analysisResult;
    try {
      analysisResult = await ollamaService.analyzePrescription(input.rawText);
    } catch (error) {
      throw new Error(
        `Failed to analyze prescription: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    // Store prescription and analysis in database
    const prescription = await prisma.prescription.create({
      data: {
        userId: userId,
        rawText: input.rawText,
        uploadedImagePath: input.uploadedImagePath || null,
        analysisResults: {
          create: {
            llmResponse: analysisResult,
          },
        },
      },
      include: {
        analysisResults: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return {
      id: prescription.id,
      rawText: prescription.rawText,
      uploadedImagePath: prescription.uploadedImagePath,
      createdAt: prescription.createdAt,
      analysis: prescription.analysisResults[0]?.llmResponse || analysisResult,
    };
  }

  /**
   * Gets prescription history for a user
   */
  async getPrescriptionHistory(userId: string): Promise<PrescriptionWithAnalysis[]> {
    const prescriptions = await prisma.prescription.findMany({
      where: {
        userId: userId,
      },
      include: {
        analysisResults: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prescriptions.map((prescription) => ({
      id: prescription.id,
      rawText: prescription.rawText,
      uploadedImagePath: prescription.uploadedImagePath,
      createdAt: prescription.createdAt,
      analysis: prescription.analysisResults[0]?.llmResponse || null,
    }));
  }

  /**
   * Gets a single prescription by ID (with user verification)
   */
  async getPrescriptionById(
    prescriptionId: string,
    userId: string
  ): Promise<PrescriptionWithAnalysis | null> {
    const prescription = await prisma.prescription.findFirst({
      where: {
        id: prescriptionId,
        userId: userId,
      },
      include: {
        analysisResults: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!prescription) {
      return null;
    }

    return {
      id: prescription.id,
      rawText: prescription.rawText,
      uploadedImagePath: prescription.uploadedImagePath,
      createdAt: prescription.createdAt,
      analysis: prescription.analysisResults[0]?.llmResponse || null,
    };
  }
}

