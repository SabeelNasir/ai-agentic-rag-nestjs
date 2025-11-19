import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum AICompletionsType {
  ImproveWriting = "improve-writing",
  FixGrammer = "fix-grammer",
}

export class DtoDocsAICompletionsRequest {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsEnum(AICompletionsType)
  type: AICompletionsType;
}