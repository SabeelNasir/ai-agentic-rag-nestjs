import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { FoodGraphStateType } from "../state/food-graph-state";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

const locationSchema = z.object({
  location: z.string(),
});
const locationParser = StructuredOutputParser.fromZodSchema(locationSchema);

const LocationPrompt = ChatPromptTemplate.fromMessages([
  ["system", `Extract the city/location from user message. Respond as JSON: {"location":"city name"}.`],
  ["human", "{input}"],
]);

export const LocationNode = (model: ChatGroq) => {
  return async (state: FoodGraphStateType) => {
    const formatted = await LocationPrompt.format({
      input: state.messages[state.messages.length - 1].content,
    });
    const resp = await model.invoke(formatted);
    const parsed = await locationParser.parse(resp.content.toString());

    return {
      ...state,
      location: parsed.location,
      messages: [...state.messages, new AIMessage(`Great! I’ll suggest food ideas popular in ${parsed.location}. 🍲`)],
    };
  };
};


/**
 * Alternative Location Node which handles missing location scenarios gracefully
 * @param model 
 * @returns 
 */
export const LocationNodev2 = (model: ChatGroq | ChatOpenAI) => {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      city: z.string().describe("city name which user mentioned"),
    }),
  );

  return async (state: FoodGraphStateType) => {
    const lastMessage = state.messages[state.messages.length - 1];

    try {
      const llmResp = await model.invoke([
        new HumanMessage(`Extract city name from this user message. If city/location not found then return {"city": null}.
          Message Input is: "${lastMessage.content}"`),
      ]);
      const parsed = await parser.parse(llmResp.content.toString());
      if (!parsed.city) {
        return {
          ...state,
          location: null,
          messages: [
            ...state.messages,
            new AIMessage("Please tell your city/location so I can suggest food ideas for your location."),
          ],
        };
      } else {
        return {
          ...state,
          location: parsed.city.trim(),
          messages: [
            ...state.messages,
            new AIMessage(`Got it! You are in ${parsed.city}, lets find out food ideas for this location.`),
          ],
        };
      }
    } catch (err) {
      return {
        ...state,
        location: null,
        messages: [
          ...state.messages,
          new AIMessage(
            `Coudn't detect the location, please share your location or city details for appropriate food recipies ideas !`,
          ),
        ],
      };
    }
  };
};
