import axios, { AxiosInstance } from 'axios';
import http from 'http';
import https from 'https';
import { buildMedicalPrompt } from '../utils/promptBuilder';
import { parseLLMResponse } from '../utils/responseParser';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:1.5b';

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
  };
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

/**
 * Service for interacting with Ollama LLM
 * Optimized for speed and reliability
 */
export class OllamaService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Create optimized axios instance with connection reuse
    this.axiosInstance = axios.create({
      baseURL: OLLAMA_BASE_URL,
      timeout: 45000, // 45 seconds - optimized for qwen2.5:1.5b speed
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable HTTP keep-alive for connection reuse
      httpAgent: new http.Agent({ keepAlive: true, keepAliveMsecs: 1000 }),
      httpsAgent: new https.Agent({ keepAlive: true, keepAliveMsecs: 1000 }),
    });
  }

  /**
   * Analyzes prescription text using Ollama LLM
   * Optimized for qwen2.5:1.5b model speed
   */
  async analyzePrescription(prescriptionText: string): Promise<any> {
    try {
      // Validate input
      if (!prescriptionText || prescriptionText.trim().length === 0) {
        throw new Error('Prescription text is required');
      }

      const prompt = buildMedicalPrompt(prescriptionText);
      
      // Optimized request payload for qwen2.5:1.5b
      const requestPayload: OllamaGenerateRequest = {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3, // Lower temperature for more consistent JSON output
          top_p: 0.9,
          top_k: 40,
          num_predict: 2000, // Limit tokens for faster response
        },
      };

      const startTime = Date.now();
      
      const response = await this.axiosInstance.post<OllamaGenerateResponse>(
        '/api/generate',
        requestPayload
      );

      const duration = Date.now() - startTime;
      console.log(`[Ollama] Analysis completed in ${duration}ms using ${OLLAMA_MODEL}`);

      if (!response.data || !response.data.response) {
        throw new Error('Empty response from Ollama');
      }

      // Parse and validate the LLM response
      const parsedResponse = parseLLMResponse(response.data.response);
      
      return parsedResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new Error('Ollama service is not running. Please ensure Ollama is running on localhost:11434');
        }
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
          throw new Error(`Ollama request timed out after 45 seconds. The model ${OLLAMA_MODEL} may be slow or unavailable.`);
        }
        if (error.response?.status === 404) {
          throw new Error(`Model ${OLLAMA_MODEL} not found. Please ensure the model is installed: ollama pull ${OLLAMA_MODEL}`);
        }
        if (error.response?.status === 500) {
          throw new Error(`Ollama server error: ${error.response.data?.error || 'Internal server error'}`);
        }
        throw new Error(`Ollama API error: ${error.message}`);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while analyzing prescription');
    }
  }

  /**
   * Health check for Ollama service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/api/tags', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.error('[Ollama] Health check failed:', error);
      return false;
    }
  }

  /**
   * Verify model is available
   */
  async verifyModel(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/api/tags', { timeout: 5000 });
      const models = response.data?.models || [];
      return models.some((m: any) => m.name === OLLAMA_MODEL);
    } catch (error) {
      return false;
    }
  }
}

