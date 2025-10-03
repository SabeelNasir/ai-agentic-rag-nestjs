import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullBoardController } from "./bull-board.controller";

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const prefix = configService.get<string>("REDIS_PREFIX");
        const config: any = {
          redis: {
            host: configService.get("REDIS_HOST"),
            port: configService.get<number>("REDIS_PORT"),
          },
        };
        if (prefix) {
          config.prefix = prefix;
        }
        return config;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [BullBoardController],
})
export class BullQueuesModule {}
