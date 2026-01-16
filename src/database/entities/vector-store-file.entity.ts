import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VectorStoreEntity } from "./vector-store.entity";
import { UploadFileEntity } from "./upload-file.entity";

/**
 * Table to store the relationship between vector store and uploaded files
 */

@Entity({ name: "vector_store_file" })
export class VectorStoreFileEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "vector_store_file_id_pk" })
  id: number;

  @ManyToOne(() => VectorStoreEntity, (store) => store.id, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "vector_store_id", foreignKeyConstraintName: "vector_store_file_vector_store_id_fk" })
  vectorStore: VectorStoreEntity;

  @OneToOne(() => UploadFileEntity, { eager: true })
  @JoinColumn({ name: "upload_file_id", foreignKeyConstraintName: "vector_store_file_upload_file_id_fk" })
  uploadFile: UploadFileEntity;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @Column({ type: "int", nullable: true })
  created_by?: number;
}
