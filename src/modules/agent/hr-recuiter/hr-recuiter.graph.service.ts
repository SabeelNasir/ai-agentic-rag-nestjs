import { CompiledStateGraph, MemorySaver, StateGraph } from "@langchain/langgraph";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";
import { HrRecuiterGraphState, HrRecuiterGraphStateType } from "./agents/hr-recuiter-graph-state";
import { AgentEmployeesList } from "./agents/employees-list.agent";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
import { extractLastAIMessage } from "src/common/utils";

@Injectable()
export class HrRecuiterGraphService implements OnModuleInit {
  constructor(
    private chatModel: GroqChatModelService,
    private agentEmpList: AgentEmployeesList,
  ) {}

  private graph;
  private compiledStateGraph: CompiledStateGraph<HrRecuiterGraphStateType, HrRecuiterGraphStateType>;

  onModuleInit() {
    this.graph = new StateGraph(HrRecuiterGraphState)
      .addNode("employees_list", this.agentEmpList.invoke(this.chatModel.getModel()))
      .addNode("employees_summary_list", this.agentEmpList.summaryInvoke(this.chatModel.getModel()))
      .addEdge("__start__", "employees_list")
      .addEdge("employees_list", "employees_summary_list");
    const checkpointer = new MemorySaver();
    this.compiledStateGraph = this.graph.compile({ checkpointer });
  }

  async callModel(prompt: string, sessionId?: string) {
    const llmResp = await this.compiledStateGraph.invoke(
      {
        messages: [new HumanMessage(prompt)],
      },
      { recursionLimit: 2, configurable: { thread_id: sessionId }, callbacks: [new ConsoleCallbackHandler()] },
    );
    return extractLastAIMessage(llmResp.messages as BaseMessage[]);
  }
}
