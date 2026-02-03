/**
 * Builds a structured medical prompt for Ollama LLM
 * Optimized for qwen2.5:1.5b - concise and direct
 * Ensures JSON-only output with strict formatting
 */
export function buildMedicalPrompt(prescriptionText: string): string {
  return `Analyze this prescription and return ONLY valid JSON. No markdown, no explanations, just JSON.

Prescription: ${prescriptionText}

Return this exact JSON structure:
{
  "medication_schedule": [{"medicine": "string", "dosage": "string", "timing": "string", "instructions": "string"}],
  "harmful_combinations": [{"medicines": ["string"], "risk": "string", "recommendation": "string"}],
  "overdose_warnings": [{"medicine": "string", "warning": "string", "max_daily_dose": "string"}],
  "side_effects": {
    "common": [{"medicine": "string", "effects": ["string"]}],
    "serious": [{"medicine": "string", "effects": ["string"], "action_required": "string"}]
  },
  "food_interactions": [{"medicine": "string", "food_item": "string", "interaction": "string", "recommendation": "string"}],
  "lifestyle_advice": [{"medicine": "string", "advice": "string", "restrictions": ["string"]}],
  "general_tips": ["string"]
}

Rules:
- Return ONLY JSON, no text before/after
- Arrays can be empty []
- Use "" for missing strings, not null
- Extract all medications, dosages, timings from prescription
- Identify drug interactions and safety warnings
- List common and serious side effects
- Provide food/lifestyle guidance
- Include helpful tips`;
}

