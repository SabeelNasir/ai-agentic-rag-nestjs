import { Controller, Get, Post, Patch, Delete, Query, Param, Body, UseGuards, Request } from "@nestjs/common";
import { MemoryService } from "./memory.service";
import { CompositeAuthGuard } from "../auth/composite-auth.guard";

@Controller("memory")
@UseGuards(CompositeAuthGuard)
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  /**
   * GET /memory/sessions?applicationId=3
   * Returns all chat sessions for the current user + application.
   */
  @Get("sessions")
  async getSessions(@Request() req, @Query("applicationId") applicationId: number) {
    const userId = req.user.id;
    const sessions = await this.memoryService.getSessionsByUserId(userId, applicationId);
    return sessions.map((s) => ({
      sessionId: s.id,
      title: s.title || "New Conversation",
      lastMessageAt: s.updated_at,
      createdAt: s.created_at,
    }));
  }

  /**
   * POST /memory/sessions
   * Create a new chat session. Body: { applicationId, agentId? }
   */
  @Post("sessions")
  async createSession(@Request() req, @Body() body: { applicationId: number; agentId?: number }) {
    const userId = req.user.id;
    const session = await this.memoryService.createSession(userId, body.applicationId, body.agentId);
    return {
      sessionId: session.id,
      title: session.title,
      createdAt: session.created_at,
    };
  }

  /**
   * PATCH /memory/sessions/:id
   * Rename a session. Body: { title }
   */
  @Patch("sessions/:id")
  async renameSession(@Param("id") id: string, @Body() body: { title: string }) {
    await this.memoryService.renameSession(id, body.title);
    return { success: true };
  }

  /**
   * DELETE /memory/sessions/:id
   * Delete a session and all its messages.
   */
  @Delete("sessions/:id")
  async deleteSession(@Param("id") id: string) {
    await this.memoryService.deleteSession(id);
    return { success: true };
  }

  /**
   * GET /memory/history?sessionId=uuid
   * Returns all messages in a session.
   */
  @Get("history")
  async getHistory(@Query("sessionId") sessionId: string) {
    const repo = this.memoryService.getRepo();
    return repo.find({
      where: { session_id: sessionId },
      order: { created_at: "ASC" },
    });
  }
}
