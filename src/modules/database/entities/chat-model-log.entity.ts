import { ENUM_CHAT_MODEL_PROVIDER } from "src/common/enums/enums";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ChatModelLog {
  @PrimaryGeneratedColumn()
  id: number; 
  
  @Column({ type: "enum", enum: ENUM_CHAT_MODEL_PROVIDER, nullable: true })
  model_provider: ENUM_CHAT_MODEL_PROVIDER;

  @Column({ type: "varchar" })
  model_name: string;

  @Column({ type: "text", nullable: true })
  api_key: string;

  @Column({ type: "varchar", nullable: true })
  request_id: string;

  @Column({ type: "int", nullable: true })
  response_code: number;

  @Column({ type: "int", nullable: true })
  input_tokens: number;

  @Column({ type: "int", nullable: true })
  output_tokens: number;

  @Column({ type: "numeric", default: 0 })
  cost: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
