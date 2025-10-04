import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vector } from "src/database/entities/vector.entity";
import { VectorstoreService } from "./vectorservice.service";

@Module({
  imports: [TypeOrmModule.forFeature([Vector])],
  providers: [VectorstoreService],
  exports: [VectorstoreService],
})
export class VectorstoreModule {}
