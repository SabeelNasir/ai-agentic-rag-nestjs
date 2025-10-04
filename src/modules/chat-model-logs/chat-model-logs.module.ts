import { Module } from "@nestjs/common";
import { ChatModelLogsService } from "./chat-model-logs.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatModelLog } from "../../database/entities/chat-model-log.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ChatModelLog])],
  providers: [ChatModelLogsService],
  exports: [ChatModelLogsService],
})
export class ChatModelLogsModule {}
