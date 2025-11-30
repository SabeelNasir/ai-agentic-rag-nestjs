import { Module } from "@nestjs/common";
import { SshAgentService } from "./ssh-agent.service";
import { GroqChatModelModule } from "src/common/chat-models/groq-chat-model/groq-chat-model.module";
import { MemoryModule } from "src/modules/memory/memory.module";
import { SshAgentPrompts } from "./prompts/ssh-agent-prompts";
import { SshAgentTools } from "./tools/ssh-agent-tools";
import { SshExecuterService } from "src/modules/ssh-executer/ssh-executer.service";

@Module({
  imports: [GroqChatModelModule, MemoryModule],
  providers: [SshAgentService, SshAgentPrompts, SshAgentTools, SshExecuterService],
  exports: [SshAgentService, SshAgentPrompts],
})
export class SshAgentModule {}
