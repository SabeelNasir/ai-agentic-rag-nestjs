import { Module } from "@nestjs/common";
import { GroqChatModelService } from "./groq-chat-model.service";

@Module({
  providers: [GroqChatModelService],
  exports: [GroqChatModelService],
})
export class GroqChatModelModule {}
