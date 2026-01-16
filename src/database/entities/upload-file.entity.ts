import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "upload_file" })
export class UploadFileEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: "upload_file_id_pk" })
  id: number;

  @Column({ type: "varchar", length: 500 })
  original_name: string;

  @Column({ type: "varchar", length: 1000 })
  file_name: string;

  @Column({ type: "varchar", length: 255 })
  mime_type: string;

  @Column({ type: "numeric" })
  file_size_kb: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @Column({ type: "int", nullable: true })
  created_by?: number;
}
