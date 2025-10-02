import { AIMessage } from "@langchain/core/messages";
import { FoodGraphStateType } from "../state/food-graph-state";

export const WelcomeNode = async (state: FoodGraphStateType) => {
  return {
    ...state,
    messages: [
      ...state.messages,
      new AIMessage(
        "👋 Hi there! Welcome to Foodie Agent. Can you tell me your location so I can suggest local food ideas?",
      ),
    ],
  };
};
