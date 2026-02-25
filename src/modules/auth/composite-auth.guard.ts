import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ApiKeyAuthGuard } from "./api-key-auth.guard";

/**
 * CompositeAuthGuard: Tries JWT auth first, falls back to API-Key auth.
 * This allows both internal users (JWT) and external applications (API key)
 * to access the same endpoints.
 */
@Injectable()
export class CompositeAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwtGuard = new JwtAuthGuard();
    const apiKeyGuard = new ApiKeyAuthGuard();
    const request = context.switchToHttp().getRequest();

    let jwtUser: any = null;
    let apiKeyUser: any = null;

    // Try JWT first
    try {
      const jwtResult = await jwtGuard.canActivate(context);
      if (jwtResult) {
        jwtUser = request.user;
      }
    } catch (_jwtError) {
      // JWT failed
    }

    // Try API-Key
    try {
      const apiKeyResult = await apiKeyGuard.canActivate(context);
      if (apiKeyResult) {
        apiKeyUser = request.user;
      }
    } catch (_apiKeyError) {
      // API Key failed
    }

    if (!jwtUser && !apiKeyUser) {
      throw new UnauthorizedException("Authentication required. Provide a valid JWT token or API key.");
    }

    // Merge logic: Prioritize JWT user identity but add application info from API Key if available
    if (jwtUser && apiKeyUser) {
      request.user = {
        ...jwtUser,
        applicationId: apiKeyUser.applicationId,
        applicationName: apiKeyUser.applicationName,
      };
    } else if (jwtUser) {
      request.user = jwtUser;
    } else {
      request.user = apiKeyUser;
    }

    return true;
  }
}
