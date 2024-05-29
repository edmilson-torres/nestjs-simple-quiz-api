import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAdmin1716937332737 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "user"("id", "firstName", "lastName", "email", "roles", "passwordHash", "createdAt", "updatedAt", "deletedAt") VALUES (DEFAULT, $1, $2, $3, $4, $5, DEFAULT, DEFAULT, DEFAULT) RETURNING "id", "roles", "createdAt", "updatedAt", "deletedAt"`,
            [
                'Admin',
                'Admin',
                'admin@mail.com',
                '{admin}',
                '$2a$10$sq/NLcp5z.BfUWRfWeenZ.0MVmtlMq68Fvg.OcAyIIAUo5qIT/t3q'
            ]
        )

        await queryRunner.query(
            `INSERT INTO "user"("id", "firstName", "lastName", "email", "roles", "passwordHash", "createdAt", "updatedAt", "deletedAt") VALUES (DEFAULT, $1, $2, $3, $4, $5, DEFAULT, DEFAULT, DEFAULT) RETURNING "id", "roles", "createdAt", "updatedAt", "deletedAt"`,
            [
                'User',
                'User',
                'user@mail.com',
                '{user}',
                '$2a$10$sq/NLcp5z.BfUWRfWeenZ.0MVmtlMq68Fvg.OcAyIIAUo5qIT/t3q'
            ]
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user"`)
    }
}
