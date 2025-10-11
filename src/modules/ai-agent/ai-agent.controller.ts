import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AiAgentService } from "./ai-agent.service";
import { AiAgentEntity } from "src/database/entities/ai-agent.entity";
import { DtoChatPayload } from "src/common/dto/chat-payload.dto";

@Controller("ai-agents")
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
  async chatWithAgent(@Param("id") id: number, @Body() payload: DtoChatPayload) {
    const sessionId = new Date().getTime().toString();
    const aiMessage = await this.service.chatWithAgent(id, payload.prompt, sessionId);
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
  ) {
    const aiMessage = await this.service.chatWithAgent(id, payload.prompt, sessionId);
    return {
      sessionId,
      response: aiMessage,
    };
  }
}
