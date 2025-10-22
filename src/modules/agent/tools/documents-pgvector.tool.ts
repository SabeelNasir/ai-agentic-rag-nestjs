import { tool } from "@langchain/core/tools";
import { Injectable, Logger } from "@nestjs/common";
import { ENUM_VECTOR_COLLECTIONS } from "src/common/enums/enums";
import { RagService } from "src/modules/rag/rag.service";
import z from "zod";

@Injectable()
export class DocumentsPgVectorTool {
  private _tool;
  private logger = new Logger(DocumentsPgVectorTool.name);

  constructor(private readonly ragService: RagService) {
    this._tool = tool(
      async ({ query, limit = 5 }) => {
        this.logger.log(`Documents Vector QUeyr: ${query}`);
        const searchResult = await this.ragService.queryVectors({
          collection: ENUM_VECTOR_COLLECTIONS.DOCUMENTS,
          limit,
          search: query,
        });
        return JSON.stringify(searchResult);
      },
      {
        name: "documents_vector_store",
        description: "vectors search tool for documents collection",
        schema: z.object({
          query: z.string().describe("query to search in vectors table for documents collection"),
          limit: z.number().describe("number of records vectors to limit"),
        }),
      },
    );
  }

  getTool() {
    return this._tool;
  }
}
