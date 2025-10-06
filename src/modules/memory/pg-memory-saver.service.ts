import { BaseMemory, InputValues, MemoryVariables, OutputValues } from "@langchain/core/memory";
import { MemoryService } from "./memory.service";
import { Repository } from "typeorm";
import { Memory } from "src/database/entities/memory.entity";
import { BaseChatMessageHistory } from "node_modules/@langchain/core/dist/chat_history";
import { Serialized, SerializedNotImplemented } from "@langchain/core/load/serializable";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { SerializedFields } from "node_modules/@langchain/core/dist/load/map_keys";

const LIMIT_PAST_CHAT = 100;

export class PgMemorySaverService implements BaseChatMessageHistory {
  private repo: Repository<Memory>;

  constructor(
    private readonly memService: MemoryService,
    private readonly sessionId?: string,
  ) {
    this.repo = this.memService.getRepo();
  }
  async getMessages(): Promise<BaseMessage[]> {
    if (this.sessionId) {
      const messages = await this.repo.find({
        where: { session_id: this.sessionId },
        take: LIMIT_PAST_CHAT,
        order: { created_at: "ASC" },
      });
      return messages.map((msg) => (msg.role === "ai" ? new AIMessage(msg.content) : new HumanMessage(msg.content)));
    } else {
      return [];
    }
  }
  addMessage(message: BaseMessage): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async addUserMessage(message: string): Promise<void> {
    await this.repo.save({ role: "user", content: message, session_id: this.sessionId });
  }
  async addAIChatMessage(message: string): Promise<void> {
    await this.repo.save({ role: "ai", content: message, session_id: this.sessionId });
  }
  async addMessages(messages: BaseMessage[]): Promise<void> {
    const payload: Partial<Memory>[] = messages.map((msg) => {
      return {
        role: msg.getType() === "ai" ? "ai" : "user",
        content: msg.content.toString(),
        session_id: this.sessionId,
      };
    });
    await this.repo.save(payload);
  }
  async clear(): Promise<void> {
    await this.repo.delete({ session_id: this.sessionId });
  }
  lc_serializable: boolean;
  lc_kwargs: SerializedFields;
  lc_namespace: string[];
  get lc_id(): string[] {
    throw new Error("Method not implemented.");
  }
  get lc_secrets(): { [key: string]: string } | undefined {
    throw new Error("Method not implemented.");
  }
  get lc_attributes(): SerializedFields | undefined {
    throw new Error("Method not implemented.");
  }
  get lc_aliases(): { [key: string]: string } | undefined {
    throw new Error("Method not implemented.");
  }
  get lc_serializable_keys(): string[] | undefined {
    throw new Error("Method not implemented.");
  }
  toJSON(): Serialized {
    throw new Error("Method not implemented.");
  }
  toJSONNotImplemented(): SerializedNotImplemented {
    throw new Error("Method not implemented.");
  }
}
