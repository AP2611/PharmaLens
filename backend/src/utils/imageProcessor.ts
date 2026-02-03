import axios, { AxiosInstance } from 'axios';
import http from 'http';
import https from 'https';
import fs from 'fs/promises';
import path from 'path';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_VISION_MODEL = process.env.OLLAMA_VISION_MODEL || 'llava:latest';

// Create optimized axios instance for vision model
const visionAxiosInstance: AxiosInstance = axios.create({
  baseURL: OLLAMA_BASE_URL,
  timeout: 90000, // 90 seconds for vision processing
  headers: {
    'Content-Type': 'application/json',
  },
  httpAgent: new http.Agent({ keepAlive: true, keepAliveMsecs: 1000 }),
  httpsAgent: new https.Agent({ keepAlive: true, keepAliveMsecs: 1000 }),
});

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
      const startTime = Date.now();
      const chatResponse = await visionAxiosInstance.post(
        '/api/chat',
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
        }
      );

      const duration = Date.now() - startTime;
      console.log(`[Ollama Vision] Text extraction completed in ${duration}ms using ${OLLAMA_VISION_MODEL}`);

      if (chatResponse.data.message?.content) {
        return chatResponse.data.message.content.trim();
      }
    } catch (chatError) {
      // If chat endpoint fails, try generate endpoint with images
      try {
        const startTime = Date.now();
        const generateResponse = await visionAxiosInstance.post(
          '/api/generate',
          {
            model: OLLAMA_VISION_MODEL,
            prompt: prompt,
            images: [base64Image],
            stream: false,
          }
        );

        const duration = Date.now() - startTime;
        console.log(`[Ollama Vision] Text extraction completed in ${duration}ms using ${OLLAMA_VISION_MODEL}`);

        if (generateResponse.data.response) {
          return generateResponse.data.response.trim();
        }
      } catch (generateError) {
        throw chatError; // Throw original error
      }
    }

    throw new Error('Empty response from Ollama vision model');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error('Ollama service is not running. Please ensure Ollama is running on localhost:11434');
      }
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        throw new Error(`Vision model request timed out after 90 seconds. The model ${OLLAMA_VISION_MODEL} may be slow or unavailable.`);
      }
      // If vision model is not available
      if (error.response?.status === 404 || error.message.includes('model')) {
        throw new Error(`Vision model ${OLLAMA_VISION_MODEL} not found. Please install it: ollama pull ${OLLAMA_VISION_MODEL}`);
      }
      if (error.response?.status === 500) {
        throw new Error(`Ollama server error: ${error.response.data?.error || 'Internal server error'}`);
      }
      throw new Error(`Ollama vision API error: ${error.message}`);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while extracting text from image');
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

