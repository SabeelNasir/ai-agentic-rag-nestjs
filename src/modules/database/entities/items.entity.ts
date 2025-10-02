import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "item" })
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "vector", length: 1536 })
  embedding: number[];

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
