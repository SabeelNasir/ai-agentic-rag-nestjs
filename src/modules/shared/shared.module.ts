import { Global, Module } from "@nestjs/common";
import { LangchainHandlerModule } from "src/common/langchain-handlers/langchain-handler.module";
import { EnvConfigModule } from "src/config/env-config.module";
import { EnvConfigService } from "src/config/env-config.service";

@Global()
@Module({
  imports: [EnvConfigModule],
  providers: [],
  exports: [],
})
export class SharedModule {}
