import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatModelLog } from "../../database/entities/chat-model-log.entity";
import { ApplicationEntity } from "../../database/entities/application.entity";
import { AiAgentEntity } from "../../database/entities/ai-agent.entity";
import { User } from "../../database/entities/user.entity";
import { ChatSession } from "../../database/entities/chat-session.entity";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ChatModelLog, ApplicationEntity, AiAgentEntity, User, ChatSession])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
