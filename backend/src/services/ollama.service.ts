import axios from 'axios';
import { buildMedicalPrompt } from '../utils/promptBuilder';
import { parseLLMResponse } from '../utils/responseParser';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:1.5b';

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

/**
 * Service for interacting with Ollama LLM
 */
export class OllamaService {
  /**
   * Analyzes prescription text using Ollama LLM
   */
  async analyzePrescription(prescriptionText: string): Promise<any> {
    try {
      const prompt = buildMedicalPrompt(prescriptionText);
      
      const requestPayload: OllamaGenerateRequest = {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
      };

      const response = await axios.post<OllamaGenerateResponse>(
        `${OLLAMA_BASE_URL}/api/generate`,
        requestPayload,
        {
          timeout: 60000, // 60 second timeout
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.response) {
        throw new Error('Empty response from Ollama');
      }

      // Parse and validate the LLM response
      const parsedResponse = parseLLMResponse(response.data.response);
      
      return parsedResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Ollama service is not running. Please start Ollama on localhost:11434');
        }
        if (error.code === 'ETIMEDOUT') {
          throw new Error('Ollama request timed out. The model may be too slow or unavailable.');
        }
        throw new Error(`Ollama API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Health check for Ollama service
   */
  async healthCheck(): Promise<boolean> {
    try {
      await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

