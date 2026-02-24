import { tool } from "@langchain/core/tools";
import { RunnableConfig } from "@langchain/core/runnables";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AiAgentToolEntity } from "src/database/entities/ai-agent-tool.entity";
import { Repository } from "typeorm";
import axios from "axios";
import z from "zod";
import https from "https";
import { ENUM_TOOL_TYPES } from "src/common/enums/enums";
import { DocumentsPgVectorTool } from "../agent/tools/documents-pgvector.tool";

interface QueryParamSpec {
  type: "string" | "number" | "boolean";
  required?: boolean;
  description?: string;
}

@Injectable()
export class AiAgentToolService {
  constructor(
    @InjectRepository(AiAgentToolEntity) private readonly repo: Repository<AiAgentToolEntity>,
    private readonly docsPgVectorTool: DocumentsPgVectorTool,
  ) {}

  save(payload: Partial<AiAgentToolEntity>) {
    return this.repo.save(payload);
  }

  prepareDynamicToolsBindings(tools: AiAgentToolEntity[]) {
    if (!Array.isArray(tools) || tools.length === 0) {
      throw new Error("No tools provided for dynamic binding.");
    }

    return tools.map((item) => {
      if (item.tool_type === ENUM_TOOL_TYPES.HTTP_REQUEST) {
        return this.prepareHttpRequestTool(item);
      } else if (item.tool_type === ENUM_TOOL_TYPES.FILES_VECTOR_STORE) {
        return this.prepareFilesVectorStoreTool(item);
      }
    });
  }

  prepareHttpRequestTool(item: AiAgentToolEntity) {
    if (!item.tool_name) throw new Error("Tool missing tool_name.");
    if (!item.config?.base_url) throw new Error(`Tool ${item.tool_name} missing base_url in config.`);

    // 🧩 1. Build schema from query_params
    const queryParams = (item.config.query_params as Record<string, QueryParamSpec> | undefined) || {};
    const schemaFields: Record<string, any> = {};

    for (const [param, spec] of Object.entries(queryParams)) {
      let zType: any;

      switch (spec.type) {
        case "number":
          zType = z.number();
          break;
        case "boolean":
          zType = z.boolean();
          break;
        default:
          zType = z.string();
      }

      if (!spec.required) {
        zType = zType.optional();
      }

      schemaFields[param] = zType.describe(spec.description || "");
    }

    const argsSchema = z.object(schemaFields);

    // 🧠 2. Create dynamic tool function
    const toolFunc = async (args: z.infer<typeof argsSchema>, config: RunnableConfig): Promise<string> => {
      try {
        const url = new URL(item.config!.base_url!);

        // ✅ Support GET query parameters or POST body later if needed
        for (const [key, value] of Object.entries(args || {})) {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        }

        // 🔍 Resolve Placeholders in Headers
        const resolvedHeaders = { ...(item.config?.default_headers || {}) };
        const accessToken = (config.configurable?.accessToken as string) || "";
        const userId = (config.configurable?.userId as string | number) || "";
        const clientToken = (config.configurable?.clientToken as string) || "";

        for (const [key, value] of Object.entries(resolvedHeaders)) {
          if (typeof value === "string") {
            resolvedHeaders[key] = value
              .replace(/{{USER_TOKEN}}/g, accessToken)
              .replace(/{{USER_ID}}/g, String(userId))
              .replace(/{{CLIENT_TOKEN}}/g, clientToken);
          }
        }
        console.log("resolvedHeaders", resolvedHeaders);

        const resp = await axios.get(url.toString(), {
          headers: resolvedHeaders,
          timeout: item.config?.timeout_ms || 10000,
          httpsAgent: new https.Agent({
            rejectUnauthorized: false, // ⛔ Disable SSL verification
          }),
        });

        // ✅ Clean JSON output for LLM readability
        if (typeof resp.data === "object") {
          return JSON.stringify(resp.data, null, 2);
        }

        return String(resp.data);
      } catch (err: any) {
        console.error(`Error calling ${item.tool_name}:`, err.message);
        return `**Error calling ${item.tool_name}:** ${err.message}`;
      }
    };

    // 🧰 3. Return LangChain-compatible tool
    return tool(toolFunc, {
      name: item.tool_name!,
      description: item.description || "Dynamically generated tool.",
      schema: argsSchema,
    });
  }

  prepareFilesVectorStoreTool(item: AiAgentToolEntity) {
    return this.docsPgVectorTool.getTool(item.vectorStore?.id);
  }
}
