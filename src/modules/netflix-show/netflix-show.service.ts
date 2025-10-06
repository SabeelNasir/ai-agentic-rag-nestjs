import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NetflixShow } from "../../database/entities/netflix-show.entity";
import { Repository } from "typeorm";
import { NetflixShowRagService } from "./netflix-show-rag.service";
import { DtoPagination } from "src/common/dto/pagination.dto";

@Injectable()
export class NetflixShowService {
  constructor(
    @InjectRepository(NetflixShow) private repo: Repository<NetflixShow>,
    private readonly ragService: NetflixShowRagService,
  ) {}

  getRepo() {
    return this.repo;
  }

  getShows(query: DtoPagination) {
    return this.repo.find({ take: query.limit, skip: query.skip });
  }

  getShowById(id: string) {
    return this.repo.findOne({ where: { show_id: id } });
  }

  async updateVectorsEmbedding(body: DtoPagination) {
    const shows = await this.repo.find({ take: body.limit, skip: body.skip, order: { show_id: "ASC" } });
    await this.ragService.createEmbeddings(shows);
    return shows;
  }
}
