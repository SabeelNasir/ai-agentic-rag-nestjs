import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AgentController } from "./modules/agent/agent.controller";
import { AgentModule } from "./modules/agent/agent.module";
import { EnvConfigModule } from "./config/env-config.module";
import { DatabaseModule } from "./modules/database/datababase.module";
import { HrRecuiterAgentModule } from "./modules/agent/hr-recuiter/hr-recuiter-agent.module";

@Module({
  imports: [AgentModule, EnvConfigModule, HrRecuiterAgentModule],
  controllers: [AppController, AgentController],
  providers: [AppService],
})
export class AppModule {}
