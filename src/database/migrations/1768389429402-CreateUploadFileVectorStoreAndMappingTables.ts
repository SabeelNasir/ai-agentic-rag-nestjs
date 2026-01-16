import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUploadFileVectorStoreAndMappingTables1768389429402 implements MigrationInterface {
    name = 'CreateUploadFileVectorStoreAndMappingTables1768389429402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "upload_file" ("id" SERIAL NOT NULL, "original_name" character varying(500) NOT NULL, "file_name" character varying(1000) NOT NULL, "mime_type" character varying(255) NOT NULL, "file_size_kb" numeric NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, CONSTRAINT "upload_file_id_pk" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vector_store" ("id" SERIAL NOT NULL, "store_label" character varying(255) NOT NULL, "last_used_at" TIMESTAMP WITH TIME ZONE, "store_size_kb" numeric, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_f5802388351a8f694ac9fcc8a6" UNIQUE ("created_by"), CONSTRAINT "vector_store_id_pk" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vector_store_file" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "vector_store_id" integer, "upload_file_id" integer, CONSTRAINT "REL_af45d399383930ea34ef7fcf23" UNIQUE ("upload_file_id"), CONSTRAINT "vector_store_file_id_pk" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vector_store" ADD CONSTRAINT "vector_store_user_created_by_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vector_store_file" ADD CONSTRAINT "vector_store_file_vector_store_id_fk" FOREIGN KEY ("vector_store_id") REFERENCES "vector_store"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "vector_store_file" ADD CONSTRAINT "vector_store_file_upload_file_id_fk" FOREIGN KEY ("upload_file_id") REFERENCES "upload_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vector_store_file" DROP CONSTRAINT "vector_store_file_upload_file_id_fk"`);
        await queryRunner.query(`ALTER TABLE "vector_store_file" DROP CONSTRAINT "vector_store_file_vector_store_id_fk"`);
        await queryRunner.query(`ALTER TABLE "vector_store" DROP CONSTRAINT "vector_store_user_created_by_fk"`);
        await queryRunner.query(`DROP TABLE "vector_store_file"`);
        await queryRunner.query(`DROP TABLE "vector_store"`);
        await queryRunner.query(`DROP TABLE "upload_file"`);
    }

}
