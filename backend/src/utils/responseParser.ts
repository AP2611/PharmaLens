/**
 * Parses and validates LLM response JSON
 * Handles malformed outputs gracefully
 */

interface ParsedAnalysis {
  medication_schedule: Array<{
    medicine: string;
    dosage: string;
    timing: string;
    instructions: string;
  }>;
  harmful_combinations: Array<{
    medicines: string[];
    risk: string;
    recommendation: string;
  }>;
  overdose_warnings: Array<{
    medicine: string;
    warning: string;
    max_daily_dose: string;
  }>;
  side_effects: {
    common: Array<{
      medicine: string;
      effects: string[];
    }>;
    serious: Array<{
      medicine: string;
      effects: string[];
      action_required: string;
    }>;
  };
  food_interactions: Array<{
    medicine: string;
    food_item: string;
    interaction: string;
    recommendation: string;
  }>;
  lifestyle_advice: Array<{
    medicine: string;
    advice: string;
    restrictions: string[];
  }>;
  general_tips: string[];
}

/**
 * Extracts JSON from LLM response (may contain markdown or extra text)
 */
function extractJSON(text: string): string {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  // Find JSON object boundaries
  const startIndex = cleaned.indexOf('{');
  const endIndex = cleaned.lastIndexOf('}');
  
  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    throw new Error('No valid JSON object found in response');
  }
  
  return cleaned.substring(startIndex, endIndex + 1);
}

/**
 * Parses and validates LLM response
 */
export function parseLLMResponse(llmResponse: string): ParsedAnalysis {
  try {
    // Extract JSON from response
    const jsonString = extractJSON(llmResponse);
    
    // Parse JSON
    const parsed = JSON.parse(jsonString) as Partial<ParsedAnalysis>;
    
    // Validate and normalize structure
    const normalized: ParsedAnalysis = {
      medication_schedule: Array.isArray(parsed.medication_schedule) 
        ? parsed.medication_schedule 
        : [],
      harmful_combinations: Array.isArray(parsed.harmful_combinations)
        ? parsed.harmful_combinations
        : [],
      overdose_warnings: Array.isArray(parsed.overdose_warnings)
        ? parsed.overdose_warnings
        : [],
      side_effects: {
        common: Array.isArray(parsed.side_effects?.common)
          ? parsed.side_effects.common
          : [],
        serious: Array.isArray(parsed.side_effects?.serious)
          ? parsed.side_effects.serious
          : [],
      },
      food_interactions: Array.isArray(parsed.food_interactions)
        ? parsed.food_interactions
        : [],
      lifestyle_advice: Array.isArray(parsed.lifestyle_advice)
        ? parsed.lifestyle_advice
        : [],
      general_tips: Array.isArray(parsed.general_tips)
        ? parsed.general_tips
        : [],
    };
    
    return normalized;
  } catch (error) {
    // Return safe default structure if parsing fails
    console.error('Failed to parse LLM response:', error);
    return {
      medication_schedule: [],
      harmful_combinations: [],
      overdose_warnings: [],
      side_effects: {
        common: [],
        serious: [],
      },
      food_interactions: [],
      lifestyle_advice: [],
      general_tips: [
        'Unable to parse analysis. Please review prescription manually and consult with a healthcare provider.'
      ],
    };
  }
}

