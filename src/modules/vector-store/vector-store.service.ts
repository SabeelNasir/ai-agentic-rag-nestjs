import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepoService } from "src/common/base/base.service";
import { VectorStoreEntity } from "src/database/entities/vector-store.entity";
import { Repository } from "typeorm";
import { VectorStoreFileService } from "../vector-store-file/vector-store-file.service";
import { FileLoaderService } from "../file-loader/file-loader.service";

@Injectable()
export class VectorStoreService extends BaseRepoService<VectorStoreEntity> {
  constructor(
    @InjectRepository(VectorStoreEntity) private readonly repo: Repository<VectorStoreEntity>,
    private readonly vsfileService: VectorStoreFileService,
    private readonly fileLoader: FileLoaderService,
  ) {
    super(repo);
  }

  private readonly _listAllRelations = ["files", "createdByUser"];
  private readonly _singleRelations = ["files", "createdByUser"];

  listAll() {
    return this.findAll({ relations: this._listAllRelations });
  }

  getById(id: number) {
    return this.findOne({ relations: this._singleRelations, where: { id } });
  }

  /**
   * @description Upload files, save metadata , creating embeddings & save vectors and in
   * last map these saved files with Vector Store
   * @param files
   * @param vectorStoreId
   * @returns
   */
  async uploadFilesInVectorStore(files: Express.Multer.File[], vectorStoreId: number) {
    // TODO: wrap in single Transaction
    const vectorStore = await this.repo.findOneBy({ id: vectorStoreId });
    if (!vectorStore) {
      throw new NotFoundException("Vector store with requested id does not exist !");
    }
    const embeddedAndUploadedFiles = await this.fileLoader.uploadAndSaveFile(files, vectorStoreId);
    // Now map uploaded files with Vector Store
    const vectorStoreAndFilesMapping = await Promise.all(
      embeddedAndUploadedFiles.map(async (file) => {
        return this.vsfileService.save({
          uploadFile: file,
          vectorStore,
        });
      }),
    );
    return vectorStoreAndFilesMapping;
  }
}
