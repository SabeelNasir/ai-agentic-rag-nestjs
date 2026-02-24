import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { ApiKeyStrategy } from "./api-key.strategy";
import { jwtConstants } from "./constants";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { ApplicationModule } from "../applications/application.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "12h" },
    }),
    UsersModule,
    ApplicationModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, ApiKeyStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
