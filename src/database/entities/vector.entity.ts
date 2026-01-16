import { Entity, PrimaryColumn, Column, CreateDateColumn, Index, UpdateDateColumn } from "typeorm";

@Entity({ name: "vectors" })
@Index("vectors_collection_idx", ["collection"])
export class Vector {
  @PrimaryColumn("text")
  id: string;

  @Column("text")
  collection: string;

  // pgvector column
  @Index("vectors_embedding_ivfflat_idx", { synchronize: false })
  @Column({
    type: "vector",
    nullable: true,
    transformer: {
      to: (value: number[]) => value,
      from: (value: number[]) => value,
    },
  })
  embedding?: number[];

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: "text", nullable: true })
  embedding_text?: string;

  @Column({ type: "int", nullable: true })
  vector_store_id?: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "now()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;
}
