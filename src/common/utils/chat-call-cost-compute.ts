interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  model: string;
  provider: "openai" | "groq" | "unknown";
}

// Pricing table per 1K tokens
const pricing: Record<string, { input: number; output: number }> = {
  // ---- OpenAI examples ----
  "gpt-4o": { input: 0.0025, output: 0.01 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },

  // ---- Groq examples ----
  "qwen/qwen3-32b": { input: 0.000085, output: 0.000347 },
};

function computeCostFromMetadata(metadata: Record<string, any>): {
  provider: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
} {
  let usage: TokenUsage = {
    input_tokens: 0,
    output_tokens: 0,
    model: "unknown",
    provider: "unknown",
  };

  usage.input_tokens = metadata["tokenUsage"]["promptTokens"];
  usage.output_tokens = metadata["tokenUsage"]["completionTokens"];
  usage.model = metadata.model;

  const price = pricing[usage.model.toLowerCase()];
  if (!price) {
    return { ...usage, cost: 0 };
  }

  const inputCost = (usage.input_tokens / 1000) * price.input;
  const outputCost = (usage.output_tokens / 1000) * price.output;

  return {
    ...usage,
    cost: parseFloat((inputCost + outputCost).toFixed(6)),
  };
}

export { computeCostFromMetadata };
