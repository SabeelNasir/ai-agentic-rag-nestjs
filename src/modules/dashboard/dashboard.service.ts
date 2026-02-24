import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatModelLog } from "../../database/entities/chat-model-log.entity";
import { ApplicationEntity } from "../../database/entities/application.entity";
import { AiAgentEntity } from "../../database/entities/ai-agent.entity";
import { User } from "../../database/entities/user.entity";
import { ChatSession } from "../../database/entities/chat-session.entity";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ChatModelLog) private logRepo: Repository<ChatModelLog>,
    @InjectRepository(ApplicationEntity) private appRepo: Repository<ApplicationEntity>,
    @InjectRepository(AiAgentEntity) private agentRepo: Repository<AiAgentEntity>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ChatSession) private sessionRepo: Repository<ChatSession>,
  ) {}

  /**
   * Aggregate summary stats for the dashboard KPI cards.
   */
  async getStats() {
    const [totalApplications, totalAgents, totalUsers, totalSessions] = await Promise.all([
      this.appRepo.count(),
      this.agentRepo.count(),
      this.userRepo.count(),
      this.sessionRepo.count(),
    ]);

    // Active API keys = applications that have a non-null api_key_hash AND are active
    const activeApiKeys = await this.appRepo
      .createQueryBuilder("app")
      .where("app.api_key_hash IS NOT NULL")
      .andWhere("app.is_active = :active", { active: true })
      .getCount();

    // Total cost for current month (MTD)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const costResult = await this.logRepo
      .createQueryBuilder("log")
      .select("COALESCE(SUM(log.cost), 0)", "totalCost")
      .addSelect("COALESCE(SUM(log.input_tokens + log.output_tokens), 0)", "totalTokens")
      .addSelect("COUNT(log.id)", "totalRequests")
      .where("log.created_at >= :monthStart", { monthStart })
      .getRawOne();

    // Previous month cost for comparison
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = monthStart;

    const prevCostResult = await this.logRepo
      .createQueryBuilder("log")
      .select("COALESCE(SUM(log.cost), 0)", "totalCost")
      .where("log.created_at >= :prevMonthStart AND log.created_at < :prevMonthEnd", {
        prevMonthStart,
        prevMonthEnd,
      })
      .getRawOne();

    const totalCost = parseFloat(costResult.totalCost);
    const prevCost = parseFloat(prevCostResult.totalCost);
    const costChangePercent = prevCost > 0 ? (((totalCost - prevCost) / prevCost) * 100).toFixed(1) : null;

    return {
      totalApplications,
      activeApiKeys,
      totalAgents,
      totalUsers,
      totalSessions,
      totalCost,
      totalTokens: parseInt(costResult.totalTokens),
      totalRequests: parseInt(costResult.totalRequests),
      costChangePercent: costChangePercent ? parseFloat(costChangePercent) : null,
    };
  }

  /**
   * Daily token + cost usage over the last N days for the area chart.
   */
  async getUsageOverTime(days: number = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await this.logRepo
      .createQueryBuilder("log")
      .select("DATE(log.created_at)", "date")
      .addSelect("COALESCE(SUM(log.input_tokens + log.output_tokens), 0)", "tokens")
      .addSelect("COALESCE(SUM(log.cost), 0)", "cost")
      .addSelect("COUNT(log.id)", "requests")
      .where("log.created_at >= :since", { since })
      .groupBy("DATE(log.created_at)")
      .orderBy("DATE(log.created_at)", "ASC")
      .getRawMany();

    return rows.map((r) => ({
      date: r.date,
      tokens: parseInt(r.tokens),
      cost: parseFloat(r.cost),
      requests: parseInt(r.requests),
    }));
  }

  /**
   * Top applications ranked by usage (request count, cost, tokens).
   */
  async getTopApplications(limit: number = 5) {
    const rows = await this.logRepo
      .createQueryBuilder("log")
      .select("log.application_id", "applicationId")
      .addSelect("COALESCE(SUM(log.cost), 0)", "totalCost")
      .addSelect("COALESCE(SUM(log.input_tokens + log.output_tokens), 0)", "totalTokens")
      .addSelect("COUNT(log.id)", "totalRequests")
      .where("log.application_id IS NOT NULL")
      .groupBy("log.application_id")
      .orderBy("COUNT(log.id)", "DESC")
      .limit(limit)
      .getRawMany();

    // Enrich with application names
    const appIds = rows.map((r) => r.applicationId).filter(Boolean);
    const apps = appIds.length > 0 ? await this.appRepo.createQueryBuilder("app").whereInIds(appIds).getMany() : [];
    const appMap = new Map(apps.map((a) => [a.id, a.name]));

    return rows.map((r) => ({
      applicationId: r.applicationId,
      applicationName: appMap.get(r.applicationId) || `App #${r.applicationId}`,
      totalCost: parseFloat(r.totalCost),
      totalTokens: parseInt(r.totalTokens),
      totalRequests: parseInt(r.totalRequests),
    }));
  }

  /**
   * Recent activity feed from chat model logs.
   */
  async getRecentActivity(limit: number = 10) {
    const logs = await this.logRepo
      .createQueryBuilder("log")
      .orderBy("log.created_at", "DESC")
      .limit(limit)
      .getRawMany();

    // Enrich with app names
    const appIds = [...new Set(logs.map((l) => l.log_application_id).filter(Boolean))];
    const apps = appIds.length > 0 ? await this.appRepo.createQueryBuilder("app").whereInIds(appIds).getMany() : [];
    const appMap = new Map(apps.map((a) => [a.id, a.name]));

    return logs.map((l) => ({
      id: l.log_id,
      modelProvider: l.log_model_provider,
      modelName: l.log_model_name,
      inputTokens: l.log_input_tokens,
      outputTokens: l.log_output_tokens,
      cost: parseFloat(l.log_cost || 0),
      latency: parseFloat(l.log_latency || 0),
      responseCode: l.log_response_code,
      applicationId: l.log_application_id,
      applicationName: appMap.get(l.log_application_id) || null,
      userId: l.log_user_id,
      createdAt: l.log_created_at,
    }));
  }
}
