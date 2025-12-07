import { MigrationInterface, QueryRunner } from "typeorm";

export class MissingTables1765118293048 implements MigrationInterface {
    name = 'MissingTables1765118293048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."chat_model_log_model_provider_enum" AS ENUM('groq', 'openai', 'anthropic', 'azure-openai')`);
        await queryRunner.query(`CREATE TABLE "chat_model_log" ("id" SERIAL NOT NULL, "model_provider" "public"."chat_model_log_model_provider_enum", "model_name" character varying NOT NULL, "api_key" text, "request_id" character varying, "response_code" integer, "input_tokens" integer, "output_tokens" integer, "cost" numeric NOT NULL DEFAULT '0', "latency" numeric NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_942de9df4b2fea50e6fe12ea8ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_12d79e4940385900bdee7453bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "price" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" integer, CONSTRAINT "PK_398d3643b03f14a730b364c7515" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item" ("id" SERIAL NOT NULL, "embedding" vector(1536) NOT NULL, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."chat_memory_role_enum" AS ENUM('user', 'ai', 'system')`);
        await queryRunner.query(`CREATE TABLE "chat_memory" ("id" SERIAL NOT NULL, "session_id" character varying NOT NULL, "role" "public"."chat_memory_role_enum" NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f0117735a70a683b4e029b5b6b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_sessionId" ON "chat_memory" ("session_id") `);
        await queryRunner.query(`CREATE TABLE "netflix_shows" ("show_id" text NOT NULL, "type" text, "title" text, "director" text, "cast_members" text, "country" text, "date_added" date, "release_year" integer, "rating" text, "duration" text, "listed_in" text, "description" text, CONSTRAINT "PK_7a4c421c44ce589cd29b1a7bfef" PRIMARY KEY ("show_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(150) NOT NULL, "email" character varying(255), "password" character varying(255) NOT NULL, "name" character varying(150), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "food_product" ADD CONSTRAINT "fk_food_product_category" FOREIGN KEY ("category_id") REFERENCES "food_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_product" DROP CONSTRAINT "fk_food_product_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "netflix_shows"`);
        await queryRunner.query(`DROP INDEX "public"."idx_sessionId"`);
        await queryRunner.query(`DROP TABLE "chat_memory"`);
        await queryRunner.query(`DROP TYPE "public"."chat_memory_role_enum"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "food_product"`);
        await queryRunner.query(`DROP TABLE "food_category"`);
        await queryRunner.query(`DROP TABLE "chat_model_log"`);
        await queryRunner.query(`DROP TYPE "public"."chat_model_log_model_provider_enum"`);
    }

}
