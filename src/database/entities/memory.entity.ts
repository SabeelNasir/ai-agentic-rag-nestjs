import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatSession } from "./chat-session.entity";

@Entity("chat_memory")
export class Memory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("idx_sessionId")
  @Column({ nullable: true })
  session_id: string;

  @ManyToOne(() => ChatSession, (s) => s.messages, { nullable: true })
  @JoinColumn({ name: "session_id" })
  session: ChatSession;

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  application_id: number;

  @Column({ type: "enum", enum: ["user", "ai", "system"] })
  role: "user" | "ai" | "system";

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
