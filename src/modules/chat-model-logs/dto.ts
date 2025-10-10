import { IsDate, IsNotEmpty } from "class-validator";

export class DtoChatModelLogMonthlyCost {
  @IsDate()
  @IsNotEmpty()
  start_date: Date;

  @IsDate()
  @IsNotEmpty()
  end_date: Date;
}
