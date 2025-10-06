import { Entity, PrimaryColumn, Column, CreateDateColumn, Index, UpdateDateColumn } from "typeorm";

@Entity({ name: "vectors" })
@Index("vectors_collection_idx", ["collection"])
export class Vector {
  @PrimaryColumn("text")
  id: string;

  @Column("text")
  collection: string;

  // pgvector column
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

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "now()" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;
}
