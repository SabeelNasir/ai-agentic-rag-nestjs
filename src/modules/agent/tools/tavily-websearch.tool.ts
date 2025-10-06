import { Injectable, Logger } from "@nestjs/common";
import { TavilySearch } from "@langchain/tavily";
import { EnvConfigService } from "src/config/env-config.service";

@Injectable()
export class TavilyWebsearchTool {
  private logger = new Logger(TavilyWebsearchTool.name);
  private tool: TavilySearch;
  constructor(private envConfig: EnvConfigService) {
    const _tool = new TavilySearch({
      tavilyApiKey: this.envConfig.getTavilyApiKey(),
      maxResults: 3,
    });
    this.tool = _tool;
  }

  getTool(): TavilySearch {
    return this.tool;
  }
}
