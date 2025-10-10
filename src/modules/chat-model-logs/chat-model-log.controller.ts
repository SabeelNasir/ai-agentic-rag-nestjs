import { Controller, Get, Query } from "@nestjs/common";
import { DtoPagination } from "src/common/dto/pagination.dto";
import { ChatModelLogsService } from "./chat-model-logs.service";
import { DtoChatModelLogMonthlyCost } from "./dto";

@Controller("chat-model-log")
export class ChatModelLogController {
  constructor(private readonly service: ChatModelLogsService) {}

  @Get()
  async getAll(@Query() query: DtoPagination) {
    return this.service.getAll(query);
  }

  @Get("model-wise-cost-graph")
  getModelWiseCostGraph() {
    return this.service.getModelWiseCostGraph();
  }

  @Get("monthly-cost")
  getMonthlyCost(@Query() query: DtoChatModelLogMonthlyCost) {
    return this.service.getTotalMonthlyCost(query);
  }
}
