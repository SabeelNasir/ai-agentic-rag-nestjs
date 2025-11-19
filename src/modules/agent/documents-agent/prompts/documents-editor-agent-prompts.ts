import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMessagePromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DocumentsEditorAgentPrompts {
  constructor() {}
  private baseSystemPrompt = new SystemMessage(`{current_time}
      Return only the required output in markup which can be replaced directly in Document Editor, 
      NO extra messages!`);

  improveWriting(docContent: string) {
    const systemPrompt = new SystemMessage(
      `You are helpful Grammer & Technical Writing AI Assistant for user to help in their documents.
      `,
    );

    const userPrompt = new HumanMessage(
      `Improve writing content in the document, document content is here: ${docContent}`,
    );

    const prompt = ChatPromptTemplate.fromMessages([systemPrompt, this.baseSystemPrompt, userPrompt]);
    return prompt.formatMessages({
      current_time: new Date(),
      doc_content: docContent,
    });
  }

  fixGrammer(docContent: string) {
    const systemPrompt = new SystemMessage(
      `You are helpful AI Assistant to fix Grammer Issues in document content. Time is: {current_time}`,
    );
    const userPrompt = new HumanMessage(`Fix grammer issues in this document content: ${docContent}`);
    const prompt = ChatPromptTemplate.fromMessages([systemPrompt, this.baseSystemPrompt, userPrompt]);
    return prompt.formatMessages({ current_time: new Date() });
  }
}
