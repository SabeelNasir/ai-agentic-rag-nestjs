import { BaseMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SshAgentPrompts {
  private baseSystemPrompt = new SystemMessage(`{current_time}
      You are helpful AI Assistant for SSH operations and being SSH Agent. You can call multiple tools availabe for different required
      SSH Operations.
      Return only the required output in markup.
      `);

  sshOperations(userPrompt: string, historyMsgs: BaseMessage[]) {
    const prompt = ChatPromptTemplate.fromMessages([this.baseSystemPrompt, ...historyMsgs, userPrompt]);
    return prompt.formatMessages({});
  }
}
