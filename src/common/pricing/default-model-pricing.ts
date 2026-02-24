export interface PricingEntry {
  input: number; // Price per 1M tokens
  output: number; // Price per 1M tokens
}

/**
 * Default pricing for OpenAI and Groq models.
 * Rates are in USD per 1,000,000 (1M) tokens.
 * Conversion to per-1K happens at compute time.
 */
export const DEFAULT_MODEL_PRICING: Record<string, PricingEntry> = {
  // ---- OpenAI Models (Feb 2026 Rates) ----
  "gpt-4o": { input: 2.5, output: 10.0 },
  "gpt-4o-2024-08-06": { input: 2.5, output: 10.0 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o-mini-2024-07-18": { input: 0.15, output: 0.6 },

  "gpt-4.1": { input: 2.0, output: 8.0 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4.1-nano": { input: 0.1, output: 0.4 },

  "gpt-5": { input: 1.25, output: 10.0 },
  "gpt-5-mini": { input: 0.25, output: 2.0 },
  "gpt-5-nano": { input: 0.05, output: 0.4 },
  "gpt-5.2": { input: 1.75, output: 14.0 },

  o1: { input: 15.0, output: 60.0 },
  "o1-mini": { input: 1.1, output: 4.4 },
  "o1-pro": { input: 150.0, output: 600.0 },

  o3: { input: 2.0, output: 8.0 },
  "o3-mini": { input: 1.1, output: 4.4 },
  "o3-pro": { input: 20.0, output: 80.0 },

  "o4-mini": { input: 1.1, output: 4.4 },

  // ---- Groq Models (approx. existing table converted to per-1M) ----
  "qwen/qwen3-32b": { input: 0.085, output: 0.347 },
  "openai/gpt-oss-120b": { input: 0.15, output: 0.75 },
  "llama-3.1-8b-instant": { input: 0.15, output: 0.75 },
};
