import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { VectorStoreFileEntity } from "./vector-store-file.entity";

@Entity({ name: "vector_store" })
export class VectorStoreEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "vector_store_id_pk" })
  id: number;

  @Column({ type: "varchar", length: 255 })
  store_label: string;

  @Column({ type: "timestamptz", nullable: true })
  last_used_at?: Date;

  @Column({ type: "numeric", nullable: true })
  store_size_kb?: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @Column({ type: "int", nullable: true })
  created_by?: number;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: "created_by", foreignKeyConstraintName: "vector_store_user_created_by_fk" })
  createdByUser: User;

  @OneToMany(() => VectorStoreFileEntity, (file) => file.vectorStore)
  files: VectorStoreFileEntity[];
}
