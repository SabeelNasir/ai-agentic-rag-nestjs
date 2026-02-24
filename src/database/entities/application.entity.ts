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
import { User } from "./user.entity";
import { AiAgentEntity } from "./ai-agent.entity";

@Entity({ name: "applications" })
export class ApplicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("application_name_idx_unique", { unique: true })
  @Column({ type: "varchar", length: 150 })
  name: string; // e.g. "nucleus-frontend"

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "jsonb", nullable: true })
  config: Record<string, any>; // app-specific settings

  @Column({ type: "varchar", length: 255, nullable: true })
  api_key_hash: string; // bcrypt hash of the API key

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: true })
  agent_id: number;

  @ManyToOne(() => AiAgentEntity, { nullable: true })
  @JoinColumn({ name: "agent_id" })
  agent: AiAgentEntity;

  @CreateDateColumn({ type: "timestamptz", default: () => "now()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;
}
