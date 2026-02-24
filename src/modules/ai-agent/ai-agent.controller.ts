import { Body, Controller, Get, Param, Post, Request as NestRequest, UseGuards, Headers } from "@nestjs/common";
import { AiAgentService } from "./ai-agent.service";
import { AiAgentEntity } from "src/database/entities/ai-agent.entity";
import { DtoChatPayload } from "src/common/dto/chat-payload.dto";
import { CompositeAuthGuard } from "../auth/composite-auth.guard";

@Controller("ai-agents")
@UseGuards(CompositeAuthGuard)
export class AiAgentController {
  constructor(private readonly service: AiAgentService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get("/:id")
  getById(@Param("id") id: number) {
    return this.service.findById(id);
  }

  @Post()
  save(@Body() payload: Partial<AiAgentEntity>) {
    return this.service.save(payload);
  }

  @Post("/:id/chat")
  async chatWithAgent(
    @Param("id") id: number,
    @Body() payload: DtoChatPayload,
    @Headers("x-client-token") clientToken: string,
    @Headers("authorization") authHeader: string,
    @NestRequest() req: any,
  ) {
    const sessionId = new Date().getTime().toString();
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
    const userId = req.user?.id;

    const aiMessage = await this.service.chatWithAgent(id, payload.prompt, sessionId, clientToken, accessToken, userId);
    return {
      sessionId,
      response: aiMessage,
    };
  }

  @Post("/:id/chat/:sessionId")
  async chatWithAgentInSameSession(
    @Param("id") id: number,
    @Body() payload: DtoChatPayload,
    @Param("sessionId") sessionId: string,
    @Headers("x-client-token") clientToken: string,
    @Headers("authorization") authHeader: string,
    @NestRequest() req: any,
  ) {
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
    const userId = req.user?.id;

    const aiMessage = await this.service.chatWithAgent(id, payload.prompt, sessionId, clientToken, accessToken, userId);
    return {
      sessionId,
      response: aiMessage,
    };
  }
}
