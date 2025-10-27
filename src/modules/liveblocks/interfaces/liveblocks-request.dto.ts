import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class DtoLiveblocksAuthPayload {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  // @IsObject()
  // userInfo: {
  //   id: string;
  //   name: string;
  //   avatar?: string;
  // };
}
