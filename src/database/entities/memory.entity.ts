import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("chat_memory")
export class Memory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("idx_sessionId")
  @Column()
  session_id: string;

  @Column({ type: "enum", enum: ["user", "ai", "system"] })
  role: "user" | "ai" | "system";

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
