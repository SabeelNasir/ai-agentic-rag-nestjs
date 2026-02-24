import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateModelPricingTable1771931911428 implements MigrationInterface {
    name = 'CreateModelPricingTable1771931911428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "model_pricing" ("model" character varying NOT NULL, "input_per_1m" numeric(12,8) NOT NULL DEFAULT '0', "output_per_1m" numeric(12,8) NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6edce80f662a23e3e95146ba564" PRIMARY KEY ("model"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "model_pricing"`);
    }

}
