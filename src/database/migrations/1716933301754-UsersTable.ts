import { MigrationInterface, QueryRunner } from 'typeorm'

export class UsersTable1716933301754 implements MigrationInterface {
    name = 'UsersTable1716933301754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "roles" "public"."user_roles_enum" array NOT NULL DEFAULT '{user}', "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_d0012b9482ca5b4f270e6fdb5e" ON "user" ("email") WHERE "deletedAt" IS NULL`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "public"."IDX_d0012b9482ca5b4f270e6fdb5e"`
        )
        await queryRunner.query(`DROP TABLE "user"`)
    }
}
