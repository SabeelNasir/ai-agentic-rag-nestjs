import { Injectable } from "@nestjs/common";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { EmbeddingVectorsQueueService } from "src/microservices/queues/embedding-vectors-queue/service";
import { ENUM_VECTOR_COLLECTIONS } from "src/common/enums/enums";
import { InjectRepository } from "@nestjs/typeorm";
import { UploadFileEntity } from "src/database/entities/upload-file.entity";
import { QueryRunner, Repository } from "typeorm";

@Injectable()
export class FileLoaderService {
  constructor(
    @InjectRepository(UploadFileEntity) private readonly repo: Repository<UploadFileEntity>,
    private readonly queueService: EmbeddingVectorsQueueService,
  ) {}

  async processFileForEmbedding(filePath, vectorStoreId?: number) {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // send job for embeddings creation & store in vectors
    await this.queueService.addJob({
      collection: ENUM_VECTOR_COLLECTIONS.DOCUMENTS,
      metadata: {
        ...docs,
      },
      embedding_text: JSON.stringify(docs[0].pageContent),
      id: new Date().getTime().toString(),
      vector_store_id: vectorStoreId,
    });
    return docs[0].metadata;
  }

  async uploadAndSaveFile(files: Express.Multer.File[], vectorStoreId?: number, queryRunner?: QueryRunner) {
    let savedFiles: UploadFileEntity[] = [];
    if (files && files.length) {
      savedFiles = await Promise.all(
        files.map(async (file) => {
          await this.processFileForEmbedding(file.path, vectorStoreId);
          const fileReponse = await this.repo.save({
            original_name: file.originalname,
            mime_type: file.mimetype,
            file_name: `${file.originalname}-${new Date().getTime()}`,
            file_size_kb: file.size / 1024, // in kb
          });
          return fileReponse;
        }),
      );
    }
    return savedFiles;
  }
}
