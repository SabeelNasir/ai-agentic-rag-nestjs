import { ChatGroq } from "@langchain/groq";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { EnvConfigService } from "src/config/env-config.service";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { WeatherTool } from "./tools/weather-tool";
import { Annotation, AnnotationRoot, Messages, StateGraph } from "node_modules/@langchain/langgraph/dist/graph";
import { BinaryOperatorAggregate } from "node_modules/@langchain/langgraph/dist/channels";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { GraphState } from "./graph.state";
import { WeatherToolNode } from "./tools/graph-weather-tool";
import { FoodChefPrompt } from "./prompts/food-chef-prompt";
import { FoodGraphService } from "./food-agent/food-graph.service";

@Injectable()
export class AgentService implements OnModuleInit {
  private chatModel: ChatGroq;
  private reactAgent;
  private stateGraphAgent;

  private systemMessage = [
    "system",
    `You are a Master Chef AI Assistant also suggest recipies depending on the weather condition. 
     Stay in this context only. other wise appolize nicely. 
     Strip think tags always.
     And always return response in Markdown`,
  ];

  constructor(
    private envConfigSvc: EnvConfigService,
    private foodGraphService: FoodGraphService,
  ) {}

  onModuleInit() {
    this.chatModel = new ChatGroq({
      apiKey: this.envConfigSvc.getGroqApiKey(),
      model: this.envConfigSvc.getGroqModel()!,
    });
    this.reactAgent = createReactAgent({
      llm: this.chatModel,
      tools: [WeatherTool],
    });

    const graph = new StateGraph(GraphState)
      // .addNode("food_idea", async (state: typeof GraphState.State) => {
      //   const llmResp = await this.chatModel.invoke(
      //     [
      //       [
      //         "system",
      //         `You are Food Idea Location wise AI Assistant.
      //         Give great ideas of food as per location weather & conditions.
      //         Ask user location if you need.
      //         Strip out think tags`,
      //       ],
      //     ],
      //     { recursionLimit: 2, max_completion_tokens: this.envConfigSvc.getChatModelMaxCompletionTokens() },
      //   );
      //   return { messages: [llmResp] };
      // })
      // .addNode("food_chef", async (state: typeof GraphState.State) => {
      //   const prompt = await FoodChefPrompt(state.messages);
      //   const llmResp = await this.chatModel.invoke(prompt);
      //   return { messages: [llmResp] };
      // })
      .addNode("weather", WeatherToolNode)
      .addEdge("__start__", "weather");
    // .addEdge("food_idea", "weather")
    // .addEdge("weather", "food_chef");

    const workflow = graph.compile();
    this.stateGraphAgent = workflow;
  }

  async callModel(prompt: string) {
    // return this.chatModel.invoke([...this.systemMessage, ["human", prompt]]);

    const llmResp = await this.reactAgent.invoke({ messages: [...this.systemMessage, new HumanMessage(prompt)] });
    return llmResp.messages[llmResp.messages.length - 1];

    // const llmResp = await this.stateGraphAgent.invoke({ messages: [...this.systemMessage, new HumanMessage(prompt)] });
    // return llmResp.messages[llmResp.messages.length - 1];

    // Start conversation
    // const result = await this.foodGraphService.invoke(prompt);
    // return result.messages[result.messages.length - 1];
  }
}
