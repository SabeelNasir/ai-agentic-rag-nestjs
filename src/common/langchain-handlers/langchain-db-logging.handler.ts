import { BaseCallbackHandler } from "node_modules/@langchain/core/dist/callbacks/base";
import { computeCostFromMetadata } from "../utils/chat-call-cost-compute";

export class DBLoggingHandler extends BaseCallbackHandler {
  name = "DBLoggingHandler";

  async onLLMEnd(output, runId, parentRunId, tags) {
    const metadata = output.generations?.[0]?.[0]?.message?.response_metadata ?? {};
    const usage = computeCostFromMetadata(metadata);

    // save usage + metadata into DB
    console.log("Saving log:", usage);
  }
}
