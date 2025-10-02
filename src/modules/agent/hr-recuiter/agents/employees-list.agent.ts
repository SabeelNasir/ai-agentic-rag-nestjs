import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";
import { HrRecuiterGraphState } from "./hr-recuiter-graph-state";
import { EmployeesListPrompt } from "../prompts/employee-list-prompt";
import { EmployeesSummaryListPrompt } from "../prompts/employee-summary-list-prompt";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { Injectable } from "@nestjs/common";
import { ChatModelLogsService } from "src/modules/chat-model-logs/chat-model-logs.service";

@Injectable()
export class AgentEmployeesList {
  constructor(private logService: ChatModelLogsService) {}

  invoke(model: ChatGroq | ChatOpenAI) {
    return async (state: typeof HrRecuiterGraphState.State) => {
      const prompt = await EmployeesListPrompt(state.messages);
      const llmResp = await model.invoke(prompt);
      await this.logService.save(llmResp);
      return { messages: [llmResp] };
    };
  }
  summaryInvoke(model) {
    return async (state: typeof HrRecuiterGraphState.State) => {
      const prompt = await EmployeesSummaryListPrompt(state.messages);
      const llmResp = await model.invoke(prompt);
      await this.logService.save(llmResp);
      return { messages: [llmResp] };
    };
  }
}
