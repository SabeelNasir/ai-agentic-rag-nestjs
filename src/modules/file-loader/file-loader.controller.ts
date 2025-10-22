import { Controller, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/config/multer-config";
import { FileLoaderService } from "./file-loader.service";

@Controller("file-loader")
export class FileLoaderController {
  constructor(private readonly service: FileLoaderService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const result = await this.service.processFileForEmbedding(file.path);
    return {
      message: "Embeddings Jobs initiated and pushed in queue !",
      metadata: result,
    };
  }
}
