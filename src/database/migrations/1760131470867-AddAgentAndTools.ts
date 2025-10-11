import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAgentAndTools1760131470867 implements MigrationInterface {
    name = 'AddAgentAndTools1760131470867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ai_agents_model_provider_enum" AS ENUM('groq', 'openai', 'anthropic', 'azure-openai')`);
        await queryRunner.query(`CREATE TYPE "public"."agents_status_enum" AS ENUM('active', 'disabled')`);
        await queryRunner.query(`CREATE TABLE "agents" ("id" SERIAL NOT NULL, "name" text NOT NULL, "display_name" text, "description" text, "model_provider" "public"."ai_agents_model_provider_enum", "model_name" text, "system_prompt" jsonb, "memory_config" jsonb, "status" "public"."agents_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "ai_agent_id_pk" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "ai_agent_name_idx_unique" ON "agents" ("name") `);
        await queryRunner.query(`CREATE TABLE "agent_tools" ("id" SERIAL NOT NULL, "tool_name" text NOT NULL, "config" jsonb, "is_enabled" boolean NOT NULL DEFAULT true, "description" text, "agent_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "ai_agent_tool_id_pk" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "ai_agent_tool_tool_name_idx" ON "agent_tools" ("tool_name") `);
        await queryRunner.query(`ALTER TABLE "agent_tools" ADD CONSTRAINT "ai_agent_agent_id_fk" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agent_tools" DROP CONSTRAINT "ai_agent_agent_id_fk"`);
        await queryRunner.query(`DROP INDEX "public"."ai_agent_tool_tool_name_idx"`);
        await queryRunner.query(`DROP TABLE "agent_tools"`);
        await queryRunner.query(`DROP INDEX "public"."ai_agent_name_idx_unique"`);
        await queryRunner.query(`DROP TABLE "agents"`);
        await queryRunner.query(`DROP TYPE "public"."agents_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ai_agents_model_provider_enum"`);
    }

}
