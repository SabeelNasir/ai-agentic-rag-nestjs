import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get("usage-over-time")
  getUsageOverTime(@Query("days") days?: string) {
    return this.dashboardService.getUsageOverTime(days ? parseInt(days) : 7);
  }

  @Get("top-applications")
  getTopApplications(@Query("limit") limit?: string) {
    return this.dashboardService.getTopApplications(limit ? parseInt(limit) : 5);
  }

  @Get("recent-activity")
  getRecentActivity(@Query("limit") limit?: string) {
    return this.dashboardService.getRecentActivity(limit ? parseInt(limit) : 10);
  }
}
