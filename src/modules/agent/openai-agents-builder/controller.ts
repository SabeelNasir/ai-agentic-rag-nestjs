import { Body, Controller, Param, Post } from "@nestjs/common";
import { DtoChatPayload } from "src/common/dto/chat-payload.dto";
import { runWorkflow } from "./agent-workflow";

@Controller("openai-agents")
export class OpenAIAgentsController {
  constructor() {}

  @Post("twa-docs")
  async callAgentWorkflow(@Body() payload: DtoChatPayload) {
    const result = await runWorkflow({ input_as_text: payload.prompt });
    return {
      sessionId: new Date().getTime(),
      response: result,
    };
  }
  @Post("twa-docs/:sessionId")
  async callAgentWorkflowSameSession(@Body() payload: DtoChatPayload, @Param("sessionId") sessionId: string) {
    const result = await runWorkflow({ input_as_text: payload.prompt });
    return {
      sessionId,
      response: result,
    };
  }
}
