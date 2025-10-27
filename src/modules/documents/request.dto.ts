import { IsNotEmpty } from "class-validator";
import { DocumentEntity } from "src/database/entities/document.entity";

export class DtoDocumentsCreateRequest {
  @IsNotEmpty()
  content: any;
}
