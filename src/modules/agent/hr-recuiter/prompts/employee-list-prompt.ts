import { BaseMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { employeesSchemaParser } from "../agents/hr-recuiter-schema-parsers";

export const EmployeesListPrompt = (messages: BaseMessage[]) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful HR Recuiter AI Assistant.
       Job role mentioned in the user prompt, if hasn't yet then ask again nicely.
       As per requested job role, create a list of 10 employees. 
       Output schema instructions are: {output_schema}
       Current Time: {current_time}
       Do not include reasoning traces, inner thoughts, or <think> tags in your output. Only return the final answer in plain JSON/text.
        `,
    ],
    new MessagesPlaceholder("messages"),
  ]);
  return prompt.formatMessages({
    current_time: new Date().toISOString(),
    messages,
    output_schema: employeesSchemaParser.getFormatInstructions(),
  });
};
