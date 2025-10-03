import { Module } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { FoodGraphService } from "./food-agent/food-graph.service";
import { GroqChatModelModule } from "src/common/chat-models/groq-chat-model/groq-chat-model.module";
import { HrRecuiterAgentModule } from "./hr-recuiter/hr-recuiter-agent.module";

@Module({
  imports: [GroqChatModelModule, HrRecuiterAgentModule],
  providers: [AgentService, FoodGraphService],
  exports: [AgentService],
})
export class AgentModule {}
