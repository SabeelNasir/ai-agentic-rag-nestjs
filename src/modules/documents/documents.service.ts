import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DtoPagination } from "src/common/dto/pagination.dto";
import { DocumentEntity } from "src/database/entities/document.entity";
import { FindOptionsOrder, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { DocumentsAgentService } from "../agent/documents-agent/documents-agent.service";
import { DtoDocsAICompletionsRequest } from "./dto/documents-request.dto";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity) private readonly repo: Repository<DocumentEntity>,
    private readonly docAgentService: DocumentsAgentService,
  ) {}

  async save(payload: Partial<DocumentEntity>) {
    const saveDoc = await this.repo.save(payload);
    if (!saveDoc.liveblocks_room_id) {
      saveDoc.liveblocks_room_id = `doc-room-${saveDoc.id}`;
      await this.repo.save(saveDoc);
    }
    return saveDoc;
  }

  getAll(query: DtoPagination) {
    const orderBy: FindOptionsOrder<DocumentEntity> = query.order_by
      ? { [`${query.order_by}`]: query.order_direction }
      : {};
    return this.repo.find({ take: query.limit, skip: query.skip, order: { ...orderBy } });
  }

  getById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, patch: Partial<Document>) {
    await this.repo.update(id, patch);
    return this.repo.findOneBy({ id });
  }

  docAiCompletions(payload: DtoDocsAICompletionsRequest) {
    return this.docAgentService.docEditorAICompletions(payload.content, payload.type);
  }
}
