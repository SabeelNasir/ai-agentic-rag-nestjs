import { BaseMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

export const FoodChefPrompt = (messages: BaseMessage[]) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a food recipe AI Assistant to give exact steps for making this food idea: `],
    new MessagesPlaceholder("messages"),
  ]);
  return prompt.formatMessages({
    messages,
  });
};
