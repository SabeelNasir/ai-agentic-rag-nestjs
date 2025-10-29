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

export const USER_INFO: Liveblocks["UserMeta"][] = [
  {
    id: "charlie.layne@example.com",
    info: {
      name: "Charlie Layne",
      color: "#D583F0",
      avatar: "https://liveblocks.io/avatars/avatar-1.png",
    },
  },
  {
    id: "mislav.abha@example.com",
    info: {
      name: "Mislav Abha",
      color: "#F08385",
      avatar: "https://liveblocks.io/avatars/avatar-2.png",
    },
  },
  {
    id: "tatum-paolo@example.com",
    info: {
      name: "Tatum Paolo",
      color: "#F0D885",
      avatar: "https://liveblocks.io/avatars/avatar-3.png",
    },
  },
  {
    id: "anjali-wanda@example.com",
    info: {
      name: "Anjali Wanda",
      color: "#85EED6",
      avatar: "https://liveblocks.io/avatars/avatar-4.png",
    },
  },
  {
    id: "jody-hekla@example.com",
    info: {
      name: "Jody Hekla",
      color: "#85BBF0",
      avatar: "https://liveblocks.io/avatars/avatar-5.png",
    },
  },
  {
    id: "emil-joyce@example.com",
    info: {
      name: "Emil Joyce",
      color: "#8594F0",
      avatar: "https://liveblocks.io/avatars/avatar-6.png",
    },
  },
  {
    id: "jory-quispe@example.com",
    info: {
      name: "Jory Quispe",
      color: "#85DBF0",
      avatar: "https://liveblocks.io/avatars/avatar-7.png",
    },
  },
  {
    id: "quinn-elton@example.com",
    info: {
      name: "Quinn Elton",
      color: "#87EE85",
      avatar: "https://liveblocks.io/avatars/avatar-8.png",
    },
  },
];
