import { BaseMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { employeesSchemaParser, employeesSummarySchemaParser } from "../agents/hr-recuiter-schema-parsers";

export const EmployeesSummaryListPrompt = (messages: BaseMessage[]) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful AI Assistant to summarize the employee details in a one line for all given list of employees.
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
    output_schema: employeesSummarySchemaParser.getFormatInstructions(),
  });
};
