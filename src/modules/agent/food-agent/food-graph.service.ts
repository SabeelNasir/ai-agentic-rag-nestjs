import { Injectable, OnModuleInit } from "@nestjs/common";
import { StateGraph } from "@langchain/langgraph";
import { GraphState } from "../graph.state";
import { WelcomeNode } from "./nodes/welcome-node";
import { ChatGroq } from "@langchain/groq";
import { LocationNode, LocationNodev2 } from "./nodes/location-node";
import { FoodIdeaNode } from "./nodes/food-idea-node";
import { RecipeNode } from "./nodes/recipe-node";
import { GroqChatModelService } from "src/common/chat-models/groq-chat-model/groq-chat-model.service";

@Injectable()
export class FoodGraphService implements OnModuleInit {
  private agent;

  constructor(private readonly chatModel: GroqChatModelService) {}

  onModuleInit() {
    const model: ChatGroq = this.chatModel.getModel();

    const graph = new StateGraph(GraphState)
      .addNode("welcome", WelcomeNode)
      .addNode("location_node", LocationNodev2(model))
      .addNode("food_idea", FoodIdeaNode(model))
      //   .addNode("recipe", RecipeNode(model))
      .addEdge("__start__", "welcome")
      .addEdge("welcome", "location_node")
      //   // 👇 conditional edge: only go to food_idea if location exists
      //   .addConditionalEdges("location_node", (state) => {
      //     if (state.location && state.location.trim().length > 0) {
      //       return "food_idea";
      //     }
      //     return "location_node"; // loop back until location provided
      //   })
      .addEdge("location_node", "food_idea");
    //   .addEdge("food_idea", "recipe");

    this.agent = graph.compile();
  }

  async invoke(userInput: string) {
    return this.agent.invoke({
      messages: [{ type: "human", content: userInput }]
    });
  }
}
