import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFlagsToUserModel1763108894275 implements MigrationInterface {
  name = 'AddFlagsToUserModel1763108894275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."is_active" IS 'Indicates that the user is active.'`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "is_root" boolean NOT NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."is_root" IS 'Indicates that the user is a root user.'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."is_root" IS 'Indicates that the user is a root user.'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_root"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."is_active" IS 'Indicates that the user is active.'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
  }
}
