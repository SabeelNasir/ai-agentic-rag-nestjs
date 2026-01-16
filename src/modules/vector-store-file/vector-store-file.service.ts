import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepoService } from "src/common/base/base.service";
import { VectorStoreFileEntity } from "src/database/entities/vector-store-file.entity";
import { Repository } from "typeorm";

@Injectable()
export class VectorStoreFileService extends BaseRepoService<VectorStoreFileEntity> {
  constructor(@InjectRepository(VectorStoreFileEntity) private readonly repo: Repository<VectorStoreFileEntity>) {
    super(repo);
  }
}
