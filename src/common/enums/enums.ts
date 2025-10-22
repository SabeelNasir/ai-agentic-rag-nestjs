export enum ENUM_QUEUES {
  CHAT_MODEL_LOGGING = "chat-model-logging",
  VECTORS_EMBEDDING = "vectors-embedding",
}

export enum ENUM_CHAT_MODEL_PROVIDER {
  GROQ = "groq",
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  AZURE_OPENAI = "azure-openai",
}

export enum ENUM_VECTOR_COLLECTIONS {
  NETFLIX_SHOWS = "netflix-shows",
  DOCUMENTS = "documents",
}

export enum ENUM_MAX_OUTPUT_TOKENS {
  NETFLIX_SHOWS_CHATBOT = 1200,
}

export enum ENUM_EMITTER_EVENTS {
  EMBEDDING_COMPLETED = "embedding-completed",
}

export enum ENUM_WEBSOCKET_EVENTS {
  EMBEDDING_COMPLETED = "embedding-completed",
}

export enum ENUM_TOOL_TYPES {
  HTTP_REQUEST = "http-request",
  FILES_VECTOR_STORE = "files-vector-store",
}
