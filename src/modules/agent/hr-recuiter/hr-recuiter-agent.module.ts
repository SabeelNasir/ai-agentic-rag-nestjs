import { Module } from "@nestjs/common";
import { AgentEmployeesList } from "./agents/employees-list.agent";
import { HrRecuiterGraphService } from "./hr-recuiter.graph.service";
import { GroqChatModelModule } from "src/common/chat-models/groq-chat-model/groq-chat-model.module";
import { HrRecuiterController } from "./hr-recuiter.controller";
import { ChatModelLogsModule } from "src/modules/chat-model-logs/chat-model-logs.module";

@Module({
  imports: [GroqChatModelModule, ChatModelLogsModule],
  providers: [AgentEmployeesList, HrRecuiterGraphService],
  exports: [HrRecuiterGraphService, AgentEmployeesList],
  controllers: [HrRecuiterController],
})
export class HrRecuiterAgentModule {}
