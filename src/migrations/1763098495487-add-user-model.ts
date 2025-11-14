import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserModel1763098495487 implements MigrationInterface {
  name = 'AddUserModel1763098495487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."id" IS 'The unique user ID.'; COMMENT ON COLUMN "users"."email" IS 'The user''s email.'; COMMENT ON COLUMN "users"."password" IS 'SHA-256 hash of the user''s password.'`,
    );
    await queryRunner.query(`COMMENT ON TABLE "users" IS 'Contains the application users.'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON TABLE "users" IS NULL`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
