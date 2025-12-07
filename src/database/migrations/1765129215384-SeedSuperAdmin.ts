import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcryptjs';

export class SeedSuperAdmin1765129215384 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash('Password1', 10);
        await queryRunner.query(
            `INSERT INTO "users" ("username", "email", "password", "created_at", "updated_at") VALUES ($1, $2, $3, NOW(), NOW())`,
            ['super.admin', 'super.admin@example.com', hashedPassword]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "users" WHERE "username" = 'super.admin'`);
    }

}
