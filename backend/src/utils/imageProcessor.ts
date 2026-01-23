import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_VISION_MODEL = process.env.OLLAMA_VISION_MODEL || 'llava:latest';

/**
 * Converts image file to base64 string
 */
export async function imageToBase64(filePath: string): Promise<string> {
  const imageBuffer = await fs.readFile(filePath);
  return imageBuffer.toString('base64');
}

/**
 * Extracts text from prescription image using Ollama vision model
 */
export async function extractTextFromImage(imagePath: string): Promise<string> {
  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imagePath);
    
    // Use Ollama vision API to extract text
    // For vision models, we use the chat endpoint with images
    const prompt = `Extract all text from this prescription image. Return only the prescription text exactly as it appears, including medication names, dosages, instructions, and any other relevant information. Do not add any interpretation or analysis, just extract the raw text.`;

    // Try chat endpoint first (for vision models like llava)
    try {
      const chatResponse = await axios.post(
        `${OLLAMA_BASE_URL}/api/chat`,
        {
          model: OLLAMA_VISION_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt,
              images: [base64Image],
            },
          ],
          stream: false,
        },
        {
          timeout: 120000, // 2 minute timeout for vision processing
        }
      );

      if (chatResponse.data.message?.content) {
        return chatResponse.data.message.content.trim();
      }
    } catch (chatError) {
      // If chat endpoint fails, try generate endpoint with images
      const generateResponse = await axios.post(
        `${OLLAMA_BASE_URL}/api/generate`,
        {
          model: OLLAMA_VISION_MODEL,
          prompt: prompt,
          images: [base64Image],
          stream: false,
        },
        {
          timeout: 120000,
        }
      );

      if (generateResponse.data.response) {
        return generateResponse.data.response.trim();
      }
    }

    throw new Error('Empty response from Ollama vision model');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama service is not running. Please start Ollama on localhost:11434');
      }
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Vision model request timed out. The model may be too slow or unavailable.');
      }
      // If vision model is not available, try fallback
      if (error.response?.status === 404 || error.message.includes('model')) {
        throw new Error('Vision model not available. Please install a vision model like llava:latest using: ollama pull llava:latest');
      }
      throw new Error(`Ollama vision API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Alternative: Extract text using simple OCR approach (fallback)
 * This can be enhanced with Tesseract.js or other OCR libraries
 */
export async function extractTextFromImageFallback(imagePath: string): Promise<string> {
  // For now, return a message suggesting manual entry
  // In production, you could integrate Tesseract.js or other OCR solutions
  throw new Error(
    'Automatic text extraction is not available. Please use manual entry or install a vision model: ollama pull llava:latest'
  );
}

