import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatModelLog } from "../../database/entities/chat-model-log.entity";
import { Between, FindOptionsOrder, FindOptionsOrderValue, In, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from "typeorm";
import { AIMessageChunk } from "@langchain/core/messages";
import { EnvConfigService } from "src/config/env-config.service";
import { computeCostFromMetadata } from "src/common/utils/chat-call-cost-compute";
import { OnEvent } from "@nestjs/event-emitter";
import { DtoPagination } from "src/common/dto/pagination.dto";
import { DtoChatModelLogMonthlyCost } from "./dto";

@Injectable()
export class ChatModelLogsService {
  constructor(
    @InjectRepository(ChatModelLog) private repo: Repository<ChatModelLog>,
    private configService: EnvConfigService,
  ) {}
  private logger = new Logger(ChatModelLogsService.name);

  save(payload: Partial<ChatModelLog>) {
    return this.repo.upsert(payload, { conflictPaths: { id: true } });
  }

  getAll(
    query: DtoPagination
  ) {
    const orderBy: FindOptionsOrder<ChatModelLog> = query.order_by
      ? { [`${query.order_by}`]: query.order_direction as FindOptionsOrderValue }
      : {};

    const where: any = {};

    if (query.modelName) {
      where.model_name = Like(`%${query.modelName}%`);
    }
    if (query.modelProvider) {
      where.model_provider = Like(`%${query.modelProvider}%`);
    }
    if (query.start_date || query.end_date) {
      const startDate = query.start_date ? new Date(query.start_date) : null;
      const endDate = query.end_date ? new Date(query.end_date) : null;

      if (startDate && endDate) {
        // Ensure end_date includes the entire day if only a date is provided
        endDate.setHours(23, 59, 59, 999);
        where.created_at = Between(startDate, endDate);
      } else if (startDate) {
        where.created_at = MoreThanOrEqual(startDate);
      } else if (endDate) {
        // Ensure end_date includes the entire day if only a date is provided
        endDate.setHours(23, 59, 59, 999);
        where.created_at = LessThanOrEqual(endDate);
      }
    }

    return this.repo.find({
      take: query.limit,
      skip: query.skip,
      order: { ...orderBy },
      where: where,
    });
  }

  async getModelWiseCostGraph() {
    const data = await this.repo
      .createQueryBuilder("log")
      .select("log.model_name", "model_name")
      .addSelect("SUM(log.cost)", "total_cost")
      .addSelect("COUNT(log.id)", "total_requests")
      .groupBy("log.model_name")
      .orderBy("total_cost", "DESC")
      .getRawMany();

    // Format data for frontend (React chart)
    return data.map((item) => ({
      modelName: item.model_name,
      totalCost: parseFloat(item.total_cost),
      totalRequests: parseInt(item.total_requests),
    }));
  }

  getTotalMonthlyCost(query: DtoChatModelLogMonthlyCost) {
    return this.repo.sum("cost", { created_at: Between(new Date(query.start_date), new Date(query.end_date)) });
  }

  @OnEvent("embedding-started")
  handleEmbeddingStartedEvent(payload) {
    this.logger.log(`Embedding-started: `, payload);
  }
}
