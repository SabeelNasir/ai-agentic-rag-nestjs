import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { AiAgentEntity } from "./ai-agent.entity";

@Entity({ name: "agent_tools" })
export class AiAgentToolEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "ai_agent_tool_id_pk" })
  id: number;

  @Index("ai_agent_tool_tool_name_idx")
  @Column({ type: "text" })
  tool_name: string; // e.g. "pgvector", "tavily", "weather", "http-request"

  @Column({ type: "jsonb", nullable: true })
  config?: Record<string, any>; // dynamic configuration per tool

  @Column({ type: "boolean", default: true })
  is_enabled: boolean;

  @Column({ type: "text", nullable: true })
  description?: string; // optional, for readability or listing in UI

  @Column({ type: "number" })
  agent_id: number;

  @ManyToOne(() => AiAgentEntity, (agent) => agent.tools, { onDelete: "CASCADE", })
  @JoinColumn({ name: "agent_id",foreignKeyConstraintName: 'ai_agent_agent_id_fk' })
  agent: AiAgentEntity;

  @CreateDateColumn({ type: "timestamptz", default: () => "now()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;
}
