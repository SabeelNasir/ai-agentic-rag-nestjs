import { ChatGroq } from "@langchain/groq";
import { FoodGraphStateType } from "../state/food-graph-state";

export const FoodIdeaNode = (model: ChatGroq) => {
  return async (state: FoodGraphStateType) => {
    const resp = await model.invoke([
      ["system", "You are a food recommendation agent."],
      ["human", `Suggest 3 popular dishes in ${state.location}. Keep answers short (just dish names).`],
    ]);

    return {
      ...state,
      messages: [...state.messages, resp],
    };
  };
};
