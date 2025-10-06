import { Injectable } from "@nestjs/common";
import { TavilyWebsearchTool } from "./tavily-websearch.tool";
import z from "zod";
import { RunnableToolLike } from "@langchain/core/runnables";

@Injectable()
export class CustomWebsearchTool {
  private tool: RunnableToolLike;
  constructor(private readonly tavilyTool: TavilyWebsearchTool) {
    const schema = z.object({
      query: z.string().describe("the search query to send to the web search engine."),
    });
    const _tool = this.tavilyTool
      .getTool()
      .asTool({ description: "Web search tool", name: "custom_websearch_tool", schema });
    this.tool = _tool;
  }

  getTool() {
    return this.tool;
  }
}
