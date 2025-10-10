import { Module } from "@nestjs/common";
import { OpenAIAgentsController } from "./controller";

@Module({
  controllers: [OpenAIAgentsController],
})
export class OpenAIAgentsModule {}
