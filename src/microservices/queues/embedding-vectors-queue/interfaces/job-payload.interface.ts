export interface IEmbeddingVectorsQueuePayload {
  collection: string;
  metadata: Record<string, any>;
  id: string;
  embedding?: number[]
  embedding_text: string;
}
