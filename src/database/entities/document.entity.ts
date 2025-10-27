import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("document")
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Untitled document" })
  title: string;

  // store BlockNote / editor JSON as JSONB (Postgres). If not using Postgres JSONB, use text.
  @Column({ type: "jsonb", nullable: true })
  content: any;

  // optional persisted room id (string), use this to map your doc -> liveblocks room
  @Column({ type: "varchar", nullable: true })
  liveblocks_room_id: string | null;

  @Column({ type: "int", nullable: true })
  created_by: number;

  @Column({ type: "int", nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
