import { IsNumber, IsOptional, IsString } from "class-validator";

export class DtoPagination {
  @IsNumber()
  limit: number;

  @IsNumber()
  skip: number;

  @IsString()
  @IsOptional()
  order_by: string;

  @IsString()
  @IsOptional()
  order_direction: string;

  [key: string]: any;
}
