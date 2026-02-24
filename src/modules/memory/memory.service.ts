import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Memory } from "src/database/entities/memory.entity";
import { ChatSession } from "src/database/entities/chat-session.entity";
import { Repository } from "typeorm";

// Memory service for the chat_memory entity to persist chat memory session-wise in database

@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(Memory) private readonly repo: Repository<Memory>,
    @InjectRepository(ChatSession) private readonly sessionRepo: Repository<ChatSession>,
  ) {}

  getRepo() {
    return this.repo;
  }

  getSessionRepo() {
    return this.sessionRepo;
  }

  // ── Session CRUD ─────────────────────────────────────

  async createSession(userId?: number, applicationId?: number, agentId?: number): Promise<ChatSession> {
    const session = this.sessionRepo.create({
      user_id: userId,
      application_id: applicationId,
      agent_id: agentId,
    });
    return this.sessionRepo.save(session);
  }

  async getSessionsByUserId(userId: number, applicationId: number) {
    return this.sessionRepo.find({
      where: { user_id: userId, application_id: applicationId },
      order: { updated_at: "DESC" },
      select: ["id", "title", "created_at", "updated_at"],
    });
  }

  async getSessionById(sessionId: string) {
    return this.sessionRepo.findOne({ where: { id: sessionId } });
  }

  async updateSessionTitle(sessionId: string, title: string) {
    return this.sessionRepo.update(sessionId, { title });
  }

  async deleteSession(sessionId: string) {
    // Delete messages first, then the session
    await this.repo.delete({ session_id: sessionId });
    return this.sessionRepo.delete(sessionId);
  }

  async renameSession(sessionId: string, title: string) {
    return this.sessionRepo.update(sessionId, { title });
  }
}
