import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { ApplicationService } from "../applications/application.service";
import { Request } from "express";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "api-key") {
  constructor(private readonly appService: ApplicationService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) {
      throw new UnauthorizedException("API key missing");
    }

    const app = await this.appService.validateApiKey(apiKey);
    if (!app) {
      throw new UnauthorizedException("Invalid API key");
    }

    if (!app.user) {
      throw new UnauthorizedException("Application has no associated user");
    }

    // Return a user-like object so downstream code works identically
    return {
      id: app.user.id,
      username: app.user.username,
      email: app.user.email,
      applicationId: app.id,
      applicationName: app.name,
    };
  }
}
