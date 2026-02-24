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

    // Try JWT first
    try {
      const jwtResult = await jwtGuard.canActivate(context);
      if (jwtResult) return true;
    } catch (_jwtError) {
      // JWT failed, try API key
    }

    // Fallback to API-Key
    try {
      const apiKeyResult = await apiKeyGuard.canActivate(context);
      if (apiKeyResult) return true;
    } catch (_apiKeyError) {
      // Both strategies failed
    }

    throw new UnauthorizedException("Authentication required. Provide a valid JWT token or API key.");
  }
}
