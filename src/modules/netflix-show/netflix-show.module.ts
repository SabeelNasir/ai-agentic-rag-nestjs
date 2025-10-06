import { Module } from "@nestjs/common";
import { NetflixShowController } from "./netflix-show.controller";
import { NetflixShowService } from "./netflix-show.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NetflixShow } from "../../database/entities/netflix-show.entity";
import { NetflixShowRagService } from "./netflix-show-rag.service";
import { RagModule } from "../rag/rag.module";

@Module({
  imports: [TypeOrmModule.forFeature([NetflixShow]), RagModule],
  controllers: [NetflixShowController],
  providers: [NetflixShowService, NetflixShowRagService],
  exports: [NetflixShowService],
})
export class NetflixShowModule {}

