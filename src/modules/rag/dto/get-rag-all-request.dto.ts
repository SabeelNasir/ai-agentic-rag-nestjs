import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class DtoRagQuery {
  @IsString()
  @IsNotEmpty()
  collection: string;

  @IsString()
  @IsNotEmpty()
  search: string;

  @IsNumber()
  @IsOptional()
  limit: number;
}
