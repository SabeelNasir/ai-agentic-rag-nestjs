import { Body, Controller, Get, Param, Patch, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { VectorStoreService } from "./vector-store.service";
import { VectorStoreEntity } from "src/database/entities/vector-store.entity";
import { FilesInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/config/multer-config";
import { VectorStoreFileService } from "../vector-store-file/vector-store-file.service";
import { FileLoaderService } from "../file-loader/file-loader.service";

@Controller("vector-store")
export class VectorStoreController {
  constructor(private readonly service: VectorStoreService) {}

  @Post()
  create(@Body() payload: Partial<VectorStoreEntity>) {
    return this.service.save(payload);
  }

  @Get()
  findAll() {
    return this.service.listAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.service.getById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() payload: Partial<VectorStoreEntity>) {
    await this.service.update({ id }, payload);
    return this.service.getById(id);
  }

  @Put(":id/upload-file")
  @UseInterceptors(FilesInterceptor("files", 10, multerConfig))
  async uploadFilesInVectorStore(@Param("id") vectorStoreId: number, @UploadedFiles() files: Express.Multer.File[]) {
    return this.service.uploadFilesInVectorStore(files, vectorStoreId);
  }
}
