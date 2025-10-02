import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";
import { HrRecuiterGraphState } from "./hr-recuiter-graph-state";
import { EmployeesListPrompt } from "../prompts/employee-list-prompt";
import { EmployeesSummaryListPrompt } from "../prompts/employee-summary-list-prompt";

export class AgentEmployeesList {
  constructor() {}

  invoke(model) {
    return async (state: typeof HrRecuiterGraphState.State) => {
      const prompt = await EmployeesListPrompt(state.messages);
      const llmResp = await model.invoke(prompt);
      return { messages: [llmResp] };
    };
  }
  summaryInvoke(model) {
    return async (state: typeof HrRecuiterGraphState.State) => {
      const prompt = await EmployeesSummaryListPrompt(state.messages);
      const llmResp = await model.invoke(prompt);
      return { messages: [llmResp] };
    };
  }
}
