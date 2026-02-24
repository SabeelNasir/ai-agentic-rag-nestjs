import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Memory } from "src/database/entities/memory.entity";
import { ChatSession } from "src/database/entities/chat-session.entity";
import { MemoryService } from "./memory.service";
import { MemoryController } from "./memory.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Memory, ChatSession])],
  providers: [MemoryService],
  controllers: [MemoryController],
  exports: [MemoryService],
})
export class MemoryModule {}
