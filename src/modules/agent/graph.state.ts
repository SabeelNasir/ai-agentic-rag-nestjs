import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

// Init graph workflow
export const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  intent: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  location: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});
