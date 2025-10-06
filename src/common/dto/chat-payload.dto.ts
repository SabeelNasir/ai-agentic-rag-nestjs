import { IsString } from "class-validator";

export class DtoChatPayload {
  @IsString()
  prompt: string;
}
