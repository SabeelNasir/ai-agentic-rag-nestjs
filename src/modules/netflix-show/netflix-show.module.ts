import { Module } from "@nestjs/common";
import { NetflixShowController } from "./netflix-show.controller";
import { NetflixShowService } from "./netflix-show.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NetflixShow } from "../../database/entities/netflix-show.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NetflixShow])],
  controllers: [NetflixShowController],
  providers: [NetflixShowService],
})
export class NetflixShowModule {}

