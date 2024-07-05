import { MigrationInterface, QueryRunner } from 'typeorm'

export class FirstMigration1720188364606 implements MigrationInterface {
    name = 'FirstMigration1720188364606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "questionId" uuid, "userId" uuid, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid, "userId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "quiz" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "categoryId" uuid, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_f71164a9a1804f8ba5351bcf43" ON "quiz" ("categoryId") `
        )
        await queryRunner.query(
            `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "role" "public"."user_role_enum" array NOT NULL DEFAULT '{user}', "password" character varying NOT NULL, "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_d0012b9482ca5b4f270e6fdb5e" ON "user" ("email") WHERE "deletedAt" IS NULL`
        )
        await queryRunner.query(
            `ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "answer" ADD CONSTRAINT "FK_5a26907efcd78a856c8af5829e6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "question" ADD CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "question" ADD CONSTRAINT "FK_80f29cc01d0bd1644e389cc13be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "quiz" ADD CONSTRAINT "FK_52c158a608620611799fd63a927" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "quiz" ADD CONSTRAINT "FK_f71164a9a1804f8ba5351bcf437" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "quiz" DROP CONSTRAINT "FK_f71164a9a1804f8ba5351bcf437"`
        )
        await queryRunner.query(
            `ALTER TABLE "quiz" DROP CONSTRAINT "FK_52c158a608620611799fd63a927"`
        )
        await queryRunner.query(
            `ALTER TABLE "question" DROP CONSTRAINT "FK_80f29cc01d0bd1644e389cc13be"`
        )
        await queryRunner.query(
            `ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`
        )
        await queryRunner.query(
            `ALTER TABLE "answer" DROP CONSTRAINT "FK_5a26907efcd78a856c8af5829e6"`
        )
        await queryRunner.query(
            `ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`
        )
        await queryRunner.query(
            `DROP INDEX "public"."IDX_d0012b9482ca5b4f270e6fdb5e"`
        )
        await queryRunner.query(`DROP TABLE "user"`)
        await queryRunner.query(
            `DROP INDEX "public"."IDX_f71164a9a1804f8ba5351bcf43"`
        )
        await queryRunner.query(`DROP TABLE "quiz"`)
        await queryRunner.query(`DROP TABLE "question"`)
        await queryRunner.query(`DROP TABLE "answer"`)
        await queryRunner.query(`DROP TABLE "category"`)
    }
}
