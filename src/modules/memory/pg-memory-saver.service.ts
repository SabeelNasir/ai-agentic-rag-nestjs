import { BaseChatMessageHistory } from "node_modules/@langchain/core/dist/chat_history";
import { Serialized, SerializedNotImplemented } from "@langchain/core/load/serializable";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { SerializedFields } from "node_modules/langchain/dist/load/map_keys";
import { MemoryService } from "./memory.service";
import { Repository } from "typeorm";
import { Memory } from "src/database/entities/memory.entity";

const LIMIT_PAST_CHAT = 100;

export class PgMemorySaverService implements BaseChatMessageHistory {
  private repo: Repository<Memory>;
  private isFirstMessage = true;

  constructor(
    private readonly memService: MemoryService,
    private readonly sessionId?: string,
    private readonly userId?: number,
    private readonly applicationId?: number,
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
      this.isFirstMessage = messages.length === 0;
      return messages.map((msg) => (msg.role === "ai" ? new AIMessage(msg.content) : new HumanMessage(msg.content)));
    } else {
      return [];
    }
  }
  addMessage(message: BaseMessage): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async addUserMessage(message: string): Promise<void> {
    await this.repo.save({
      role: "user",
      content: message,
      session_id: this.sessionId,
      user_id: this.userId,
      application_id: this.applicationId,
    });

    // Auto-generate session title from the first user message
    if (this.isFirstMessage && this.sessionId) {
      const title = message.length > 100 ? message.substring(0, 100) + "..." : message;
      await this.memService.updateSessionTitle(this.sessionId, title);
      this.isFirstMessage = false;
    }
  }

  async addAIChatMessage(message: string): Promise<void> {
    await this.repo.save({
      role: "ai",
      content: message,
      session_id: this.sessionId,
      user_id: this.userId,
      application_id: this.applicationId,
    });
  }

  async addMessages(messages: BaseMessage[]): Promise<void> {
    const payload: Partial<Memory>[] = messages.map((msg) => {
      return {
        role: msg.getType() === "ai" ? "ai" : "user",
        content: msg.content.toString(),
        session_id: this.sessionId,
        user_id: this.userId,
        application_id: this.applicationId,
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
