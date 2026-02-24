interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  model: string;
  provider: "openai" | "groq" | "unknown";
}

function computeCostFromMetadata(
  metadata: Record<string, any>,
  price: { input: number; output: number } | null,
): {
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

  usage.input_tokens = metadata["tokenUsage"]?.["promptTokens"] || 0;
  usage.output_tokens = metadata["tokenUsage"]?.["completionTokens"] || 0;
  usage.model = metadata.model || metadata.model_name;

  if (!price) {
    return { ...usage, cost: 0 };
  }

  const inputCost = (usage.input_tokens / 1000) * price.input;
  const outputCost = (usage.output_tokens / 1000) * price.output;

  return {
    ...usage,
    cost: parseFloat((inputCost + outputCost).toFixed(8)),
  };
}

export { computeCostFromMetadata };
