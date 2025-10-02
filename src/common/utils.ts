import { BaseMessage } from "@langchain/core/messages";

export const extractLastAIMessage = (messages) => {
  const lastAI: BaseMessage | undefined = [...messages].reverse().find((m) => m.getType() === "ai");

  const stripped = stripThinkTags(lastAI?.content.toString()!);

  //   const content = typeof lastAI?.content === "string" ? lastAI.content : JSON.stringify(lastAI?.content ?? "");
  const content = lastAI?.content;

  return content;
};

export function stripThinkTags(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}
