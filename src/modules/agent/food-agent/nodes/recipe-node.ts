import { ChatGroq } from "@langchain/groq";
import { FoodGraphStateType } from "../state/food-graph-state";

export const RecipeNode = (model: ChatGroq) => {
  return async (state: FoodGraphStateType) => {
    const food = state.foodChoice ?? "one of the suggested dishes";

    const resp = await model.invoke([
      ["system", "You are a master chef. Provide clear cooking steps."],
      ["human", `Give me the full recipe with ingredients and step-by-step instructions for ${food}.`],
    ]);

    return {
      ...state,
      messages: [...state.messages, resp],
    };
  };
};
