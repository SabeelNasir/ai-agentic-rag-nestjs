import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterVectorsAddStoreId1768568124897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vectors ADD COLUMN vector_store_id INT NULL`);
    await queryRunner.query(
      `ALTER TABLE vectors ADD CONSTRAINT vectors_vector_store_id_fk FOREIGN KEY (vector_store_id) REFERENCES vector_store(id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vectors DROP CONSTRAINT vectors_vector_store_id_fk`);
    await queryRunner.query(`ALTER TABLE vectors DROP COLUMN vector_store_id`);
  }
}

