import { Body, Controller, Param, Post, UseGuards, Req, Headers } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { HrRecuiterGraphService } from "./hr-recuiter/hr-recuiter.graph.service";
import { NetflixShowAgent } from "./netflix-show/netflix-show.agent";
import { DtoChatPayload } from "src/common/dto/chat-payload.dto";
import { DocumentsAgentService } from "./documents-agent/documents-agent.service";
import { SshAgentService } from "./ssh-agent/ssh-agent.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PostgresAgentService } from "./postgres-agent/postgres-agent.service";
import { ApplicationService } from "../applications/application.service";

@UseGuards(JwtAuthGuard)
@Controller("agent")
export class AgentController {
  constructor(
    private service: AgentService,
    private hrAgent: HrRecuiterGraphService,
    private netflixShowsAgent: NetflixShowAgent,
    private docsAgentService: DocumentsAgentService,
    private readonly sshAgentService: SshAgentService,
    private readonly postgresAgentService: PostgresAgentService,
    private readonly appService: ApplicationService,
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
  async chatAgent(@Body() payload: DtoChatPayload, @Req() req: any, @Headers("X-Application-ID") appIdName: string) {
    const sessionId = new Date().getTime().toString();
    const resolvedAppId = await this.appService.getApplicationId(appIdName);
    const context = {
      userId: req.user?.id,
      accessToken: req.headers.authorization?.split(" ")[1],
      clientToken: req.headers["x-client-token"],
      applicationId: resolvedAppId,
    };
    const llmResp = await this.netflixShowsAgent.invoke(payload.prompt, sessionId, context);
    return {
      sessionId,
      response: llmResp,
    };
  }
  @Post("netflix-shows/:sessionId")
  async chatAgentSameSession(
    @Body() payload: DtoChatPayload,
    @Param("sessionId") sessionId: string,
    @Req() req: any,
    @Headers("X-Application-ID") appIdName: string,
  ) {
    const resolvedAppId = await this.appService.getApplicationId(appIdName);
    const context = {
      userId: req.user?.id,
      accessToken: req.headers.authorization?.split(" ")[1],
      clientToken: req.headers["x-client-token"],
      applicationId: resolvedAppId,
    };
    const llmResp = await this.netflixShowsAgent.invoke(payload.prompt, sessionId, context);
    return {
      sessionId,
      response: llmResp,
    };
  }

  @Post("docs-chat")
  async chatDocs(@Body() payload: DtoChatPayload, @Req() req: any, @Headers("X-Application-ID") appIdName: string) {
    const sessionId = new Date().getTime().toString();
    const resolvedAppId = await this.appService.getApplicationId(appIdName);
    const context = {
      userId: req.user?.id,
      accessToken: req.headers.authorization?.split(" ")[1],
      clientToken: req.headers["x-client-token"],
      applicationId: resolvedAppId,
    };
    const llmResp = await this.docsAgentService.invoke(payload.prompt, sessionId, context);
    return {
      sessionId,
      response: llmResp,
    };
  }
  @Post("docs-chat/:sessionId")
  async chatDocsSameSession(
    @Body() payload: DtoChatPayload,
    @Param("sessionId") sessionId: string,
    @Req() req: any,
    @Headers("X-Application-ID") appIdName: string,
  ) {
    const resolvedAppId = await this.appService.getApplicationId(appIdName);
    const context = {
      userId: req.user?.id,
      accessToken: req.headers.authorization?.split(" ")[1],
      clientToken: req.headers["x-client-token"],
      applicationId: resolvedAppId,
    };
    const llmResp = await this.docsAgentService.invoke(payload.prompt, sessionId, context);
    return {
      sessionId,
      response: llmResp,
    };
  }

  @Post("ssh-chat")
  async chatSshAgent(@Body() payload: DtoChatPayload, @Req() req: any, @Headers("X-Application-ID") appIdName: string) {
    const sessionId = new Date().getTime().toString();
    const resolvedAppId = await this.appService.getApplicationId(appIdName);
    const context = {
      userId: req.user?.id,
      accessToken: req.headers.authorization?.split(" ")[1],
      clientToken: req.headers["x-client-token"],
      applicationId: resolvedAppId,
    };
    const llmResp = await this.sshAgentService.invoke(payload.prompt, sessionId, context);
    return {
      sessionId,
      response: llmResp,
    };
  }
  @Post("ssh-chat/:sessionId")
  async chatSshAgentSameSession(
    @Body() payload: DtoChatPayload,
    @Param("sessionId") sessionId: string,
    @Req() req: any,
    @Headers("X-Application-ID") appIdName: string,
  ) {
    const resolvedAppId = await this.appService.getApplicationId(appIdName);
    const context = {
      userId: req.user?.id,
      accessToken: req.headers.authorization?.split(" ")[1],
      clientToken: req.headers["x-client-token"],
      applicationId: resolvedAppId,
    };
    const llmResp = await this.sshAgentService.invoke(payload.prompt, sessionId, context);
    return {
      sessionId,
      response: llmResp,
    };
  }
  @Post("postgres-chat")
  async chatPostgresAgent(
    @Body() payload: DtoChatPayload,
    @Req() req: any,
    @Headers("X-Application-ID") appIdName: string,
  ) {
    const sessionId = new Date().getTime().toString();
    const resolvedAppId = await this.appService.getApplicationId(appIdName);
    const context = {
      userId: req.user?.id,
      accessToken: req.headers.authorization?.split(" ")[1],
      clientToken: req.headers["x-client-token"],
      applicationId: resolvedAppId,
    };
    const llmResp = await this.postgresAgentService.invoke(payload.prompt, sessionId, context);
    return {
      sessionId,
      response: llmResp,
    };
  }
  @Post("postgres-chat/:sessionId")
  async chatPostgresAgentSameSession(
    @Body() payload: DtoChatPayload,
    @Param("sessionId") sessionId: string,
    @Req() req: any,
    @Headers("X-Application-ID") appIdName: string,
  ) {
    const resolvedAppId = await this.appService.getApplicationId(appIdName);
    const context = {
      userId: req.user?.id,
      accessToken: req.headers.authorization?.split(" ")[1],
      clientToken: req.headers["x-client-token"],
      applicationId: resolvedAppId,
    };
    const llmResp = await this.postgresAgentService.invoke(payload.prompt, sessionId, context);
    return {
      sessionId,
      response: llmResp,
    };
  }
}
