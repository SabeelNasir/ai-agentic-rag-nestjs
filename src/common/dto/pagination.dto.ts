import { IsNumber } from "class-validator";

export class DtoPagination {
  @IsNumber()
  limit: number;

  @IsNumber()
  skip: number;
}
