import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NetflixShow } from "../../database/entities/netflix-show.entity";
import { Repository } from "typeorm";

@Injectable()
export class NetflixShowService {
  constructor(@InjectRepository(NetflixShow) private repo: Repository<NetflixShow>) {}

  getRepo() {
    return this.repo;
  }
}
