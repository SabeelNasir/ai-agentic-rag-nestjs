import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ApplicationEntity } from "./application.entity";
import { AiAgentEntity } from "./ai-agent.entity";
import { Memory } from "./memory.entity";

@Entity("chat_sessions")
export class ChatSession {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  title: string;

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  application_id: number;

  @ManyToOne(() => ApplicationEntity, { nullable: true })
  @JoinColumn({ name: "application_id" })
  application: ApplicationEntity;

  @Column({ nullable: true })
  agent_id: number;

  @ManyToOne(() => AiAgentEntity, { nullable: true })
  @JoinColumn({ name: "agent_id" })
  agent: AiAgentEntity;

  @OneToMany(() => Memory, (m) => m.session)
  messages: Memory[];

  @CreateDateColumn({ type: "timestamptz", default: () => "now()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;
}
