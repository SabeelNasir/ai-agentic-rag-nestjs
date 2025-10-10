import { tool } from "@langchain/core/tools";
import { Injectable, Logger } from "@nestjs/common";
import { ENUM_VECTOR_COLLECTIONS } from "src/common/enums/enums";
import { RagService } from "src/modules/rag/rag.service";
import { VectorstoreService } from "src/modules/rag/vectorstore/vectorstore.service";
import z from "zod";

@Injectable()
export class NetflixShowPgVectorTool {
  private logger = new Logger(NetflixShowPgVectorTool.name);
  private tool;
  constructor(private readonly ragService: RagService) {
    this.tool = tool(
      async ({ query, limit = 5 }) => {
        this.logger.log("Vectors Query: " + query + " / Limit: " + limit);
        const searchResp = await this.ragService.queryVectors({
          collection: ENUM_VECTOR_COLLECTIONS.NETFLIX_SHOWS,
          search: query,
          limit,
        });
        return JSON.stringify(searchResp);
      },
      {
        name: "netflix_shows_search",
        description: "gather netflix shows details from database",
        schema: z.object({
          query: z.string().describe("user query to find similar records in vectors table"),
          limit: z.number().describe("number of results to return, maximum 50 is allowed.").default(2),
        }),
      },
    );
  }

  getTool() {
    return this.tool;
  }
}
