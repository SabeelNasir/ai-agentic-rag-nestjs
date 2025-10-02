import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

export const FoodGraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  location: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
    default: ()=> null,
  }),
  foodChoice: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
    default: ()=> null,
  }),
});

export type FoodGraphStateType = typeof FoodGraphState.State;