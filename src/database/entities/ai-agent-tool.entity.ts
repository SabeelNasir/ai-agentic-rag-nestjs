import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { AiAgentEntity } from "./ai-agent.entity";
import { ENUM_TOOL_TYPES } from "src/common/enums/enums";
import { VectorStoreEntity } from "./vector-store.entity";

@Entity({ name: "agent_tools" })
export class AiAgentToolEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "ai_agent_tool_id_pk" })
  id: number;

  @Index("ai_agent_tool_tool_name_idx")
  @Column({ type: "text" })
  tool_name: string;

  @Column({
    type: "enum",
    enum: ENUM_TOOL_TYPES,
    enumName: "agent_tool_type_enum",
    nullable: false,
    default: ENUM_TOOL_TYPES.HTTP_REQUEST,
  })
  tool_type: ENUM_TOOL_TYPES; // e.g. "http-request", "files-vector-store", "files"

  @Column({ type: "jsonb", nullable: true })
  config?: Record<string, any>; // dynamic configuration per tool

  @Column({ type: "boolean", default: true })
  is_enabled: boolean;

  @Column({ type: "text", nullable: true })
  description?: string; // optional, for readability or listing in UI

  @Column({ type: "number" })
  agent_id: number;

  @ManyToOne(() => AiAgentEntity, (agent) => agent.tools, { onDelete: "CASCADE" })
  @JoinColumn({ name: "agent_id", foreignKeyConstraintName: "ai_agent_agent_id_fk" })
  agent: AiAgentEntity;

  @ManyToOne(() => VectorStoreEntity, { onUpdate: "CASCADE", onDelete: "CASCADE", nullable: true, eager: true })
  @JoinColumn({ name: "vector_store_id", foreignKeyConstraintName: "agent_tools_vector_store_fk" })
  vectorStore?: VectorStoreEntity;

  @CreateDateColumn({ type: "timestamptz", default: () => "now()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;
}
