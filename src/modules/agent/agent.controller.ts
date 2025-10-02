import { Body, Controller, Param, Post } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { HrRecuiterGraphService } from "./hr-recuiter/hr-recuiter.graph.service";

@Controller("agent")
export class AgentController {
  constructor(
    private service: AgentService,
    private hrAgent: HrRecuiterGraphService,
  ) {}

  @Post("chef")
  async chatChef(@Body() payload: { prompt: string }) {
    const sessionId = new Date().getTime().toString();
    const llmResp = await this.service.callModel(payload.prompt);
    return {
      sessionId,
      response: llmResp.content,
    };
  }

  @Post("chef/:sessionId")
  async chatChefSameSession(@Param("sessionId") sessionId: number, @Body() payload: { prompt: string }) {
    const llmResp = await this.service.callModel(payload.prompt);
    return {
      sessionId,
      response: llmResp.content,
    };
  }
}
