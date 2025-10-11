import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from "typeorm";
import { ENUM_CHAT_MODEL_PROVIDER } from "src/common/enums/enums";
import { AiAgentToolEntity } from "./ai-agent-tool.entity";

export enum ENUM_AGENT_STATUS {
  ACTIVE = "active",
  DISABLED = "disabled",
}

@Entity({ name: "agents" })
export class AiAgentEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "ai_agent_id_pk" })
  id: number;

  @Index("ai_agent_name_idx_unique", { unique: true })
  @Column({ type: "text" })
  name: string; // agent unique identifier or code, e.g. "support_agent"

  @Column({ type: "text", nullable: true })
  display_name?: string; // user-friendly name, e.g. "Customer Support Bot"

  @Column({ type: "text", nullable: true })
  description?: string; // e.g., "Handles product FAQs and order tracking."

  @Column({ type: "enum", enum: ENUM_CHAT_MODEL_PROVIDER, nullable: true, enumName: "ai_agents_model_provider_enum" })
  model_provider?: ENUM_CHAT_MODEL_PROVIDER; // e.g., "openai"

  @Column({ type: "text", nullable: true })
  model_name?: string; // e.g., "gpt-4o-mini", "mixtral-8x7b"

  @Column({ type: "jsonb", nullable: true })
  system_prompt?: Record<string, any>; // for custom system or personality setup

  @Column({ type: "jsonb", nullable: true })
  memory_config?: Record<string, any>; // for long-term memory, vector references, etc.

  @Column({ type: "enum", enum: ENUM_AGENT_STATUS, default: ENUM_AGENT_STATUS.ACTIVE })
  status: ENUM_AGENT_STATUS;

  @OneToMany(() => AiAgentToolEntity, (tool) => tool.agent, { cascade: true, eager: true })
  tools?: AiAgentToolEntity[];

  @CreateDateColumn({ type: "timestamptz", default: () => "now()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;
}
