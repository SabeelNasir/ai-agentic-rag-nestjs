import { Body, Controller, Param, Post } from "@nestjs/common";
import { HrRecuiterGraphService } from "./hr-recuiter.graph.service";

@Controller("hr-recuiter")
export class HrRecuiterController {
  constructor(private service: HrRecuiterGraphService) {}

  @Post("")
  async chatChef(@Body() payload: { prompt: string }) {
    const sessionId = new Date().getTime().toString();
    const llmResp = await this.service.callModel(payload.prompt, sessionId);
    return {
      sessionId,
      response: llmResp,
    };
  }

  @Post(":sessionId")
  async chatChefSameSession(@Param("sessionId") sessionId: number, @Body() payload: { prompt: string }) {
    const llmResp = await this.service.callModel(payload.prompt);
    return {
      sessionId,
      response: llmResp,
    };
  }
}
