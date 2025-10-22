import { Body, Controller, Param, Post } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { HrRecuiterGraphService } from "./hr-recuiter/hr-recuiter.graph.service";
import { NetflixShowAgent } from "./netflix-show/netflix-show.agent";
import { DtoChatPayload } from "src/common/dto/chat-payload.dto";
import { DocumentsAgentService } from "./documents-agent/documents-agent.service";

@Controller("agent")
export class AgentController {
  constructor(
    private service: AgentService,
    private hrAgent: HrRecuiterGraphService,
    private netflixShowsAgent: NetflixShowAgent,
    private docsAgentService: DocumentsAgentService,
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

  @Post("netflix-shows")
  async chatAgent(@Body() payload: DtoChatPayload) {
    const sessionId = new Date().getTime().toString();
    const llmResp = await this.netflixShowsAgent.invoke(payload.prompt, sessionId);
    return {
      sessionId,
      response: llmResp,
    };
  }
  @Post("netflix-shows/:sessionId")
  async chatAgentSameSession(@Body() payload: DtoChatPayload, @Param("sessionId") sessionId: string) {
    const llmResp = await this.netflixShowsAgent.invoke(payload.prompt, sessionId);
    return {
      sessionId,
      response: llmResp,
    };
  }

  @Post("docs-chat")
  async chatDocs(@Body() payload: DtoChatPayload) {
    const sessionId = new Date().getTime().toString();
    const llmResp = await this.docsAgentService.invoke(payload.prompt, sessionId);
    return {
      sessionId,
      response: llmResp,
    };
  }
  @Post("docs-chat/:sessionId")
  async chatDocsSameSession(@Body() payload: DtoChatPayload, @Param("sessionId") sessionId: string) {
    const llmResp = await this.docsAgentService.invoke(payload.prompt, sessionId);
    return {
      sessionId,
      response: llmResp,
    };
  }
}
