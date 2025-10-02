// src/ai/tools/weather-tool.ts
import { GraphState } from "../graph.state";
import { WeatherTool } from "./weather-tool";
import { AIMessage } from "@langchain/core/messages";

export const WeatherToolNode = async (state: typeof GraphState.State) => {
  if (!state.location) {
    return {
      ...state,
      messages: [...state.messages, new AIMessage("Please provide a location to check the weather.")],
    };
  }
  const lastUserMessage = state.messages[state.messages.length - 1].content;

  const weatherResult = await WeatherTool.invoke({ location: lastUserMessage.toString() });

  return {
    ...state,
    messages: [...state.messages, new AIMessage(weatherResult)],
  };
};
