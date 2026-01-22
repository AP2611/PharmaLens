/**
 * Builds a structured medical prompt for Ollama LLM
 * Ensures JSON-only output with strict formatting
 */
export function buildMedicalPrompt(prescriptionText: string): string {
  return `You are a medical safety assistant. Analyze the following prescription and respond ONLY in valid JSON format. Do not include any text before or after the JSON.

Prescription:
${prescriptionText}

Return a JSON object with the following exact structure:
{
  "medication_schedule": [
    {
      "medicine": "string",
      "dosage": "string",
      "timing": "string",
      "instructions": "string"
    }
  ],
  "harmful_combinations": [
    {
      "medicines": ["string"],
      "risk": "string",
      "recommendation": "string"
    }
  ],
  "overdose_warnings": [
    {
      "medicine": "string",
      "warning": "string",
      "max_daily_dose": "string"
    }
  ],
  "side_effects": {
    "common": [
      {
        "medicine": "string",
        "effects": ["string"]
      }
    ],
    "serious": [
      {
        "medicine": "string",
        "effects": ["string"],
        "action_required": "string"
      }
    ]
  },
  "food_interactions": [
    {
      "medicine": "string",
      "food_item": "string",
      "interaction": "string",
      "recommendation": "string"
    }
  ],
  "lifestyle_advice": [
    {
      "medicine": "string",
      "advice": "string",
      "restrictions": ["string"]
    }
  ],
  "general_tips": [
    "string"
  ]
}

Important: 
- Return ONLY valid JSON, no markdown, no code blocks, no explanations
- All arrays can be empty if no items found
- Use empty strings for missing values, not null
- Be thorough and accurate in your medical analysis`;

}

