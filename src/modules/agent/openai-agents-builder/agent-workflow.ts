import { fileSearchTool, Agent, AgentInputItem, Runner } from "@openai/agents";

// Tool definitions
const fileSearch = fileSearchTool(["vs_68e6a1c658c48191a575c8077c886863"]);
const twaDocsAgent = new Agent({
  name: "TWA Docs Agent",
  instructions:
    "You are a helpful assistant to answer my questions from tools available and also be analyst for analytical questions.",
  model: "gpt-5",
  tools: [fileSearch],
  modelSettings: {
    reasoning: {
      effort: "low",
    },
    store: true,
  },
});

type WorkflowInput = { input_as_text: string };

// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  const state = {};
  const conversationHistory: AgentInputItem[] = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: workflow.input_as_text,
        },
      ],
    },
  ];
  const runner = new Runner({
    traceMetadata: {
      __trace_source__: "agent-builder",
      workflow_id: "wf_68e6a35a445c8190acde8fdf8e3bfb9805f2666b0d176a7b",
    },
  });
  const twaDocsAgentResultTemp = await runner.run(twaDocsAgent, [...conversationHistory]);
  conversationHistory.push(...twaDocsAgentResultTemp.newItems.map((item) => item.rawItem));

  if (!twaDocsAgentResultTemp.finalOutput) {
    throw new Error("Agent result is undefined");
  }

  const twaDocsAgentResult = {
    output_text: twaDocsAgentResultTemp.finalOutput ?? "",
  };
  return twaDocsAgentResult.output_text;
};
