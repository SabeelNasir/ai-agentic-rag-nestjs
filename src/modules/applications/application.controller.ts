import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Get()
  async findAll() {
    const apps = await this.appService.findAll();
    return apps.map((app) => ({
      ...app,
      api_key_hash: app.api_key_hash ? "••••••" : null,
      user_name: app.user?.name || app.user?.username || null,
      agent_name: app.agent?.name || null,
    }));
  }

  @Post()
  async create(@Body() body: { name: string; description?: string; user_id?: number; agent_id?: number }) {
    return this.appService.create(body);
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() body: any) {
    delete body.api_key_hash;
    return this.appService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.appService.delete(id);
    return { message: "Application deleted" };
  }

  @Post(":id/generate-key")
  async generateKey(@Param("id") id: number) {
    return this.appService.generateApiKey(id);
  }
}
