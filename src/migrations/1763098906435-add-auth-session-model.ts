import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthSessionModel1763098906435 implements MigrationInterface {
  name = 'AddAuthSessionModel1763098906435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_sessions" ("id" SERIAL NOT NULL, "started_at" TIMESTAMP NOT NULL, "expires_at" TIMESTAMP NOT NULL, "access_token_id" integer NOT NULL, "user_id" integer NOT NULL, "device" character varying NOT NULL, CONSTRAINT "PK_641507381f32580e8479efc36cd" PRIMARY KEY ("id")); COMMENT ON COLUMN "auth_sessions"."id" IS 'The session ID.'; COMMENT ON COLUMN "auth_sessions"."started_at" IS 'The time when the session was started.'; COMMENT ON COLUMN "auth_sessions"."expires_at" IS 'The time when the session will expire.'; COMMENT ON COLUMN "auth_sessions"."access_token_id" IS 'ID of the currently issued access token.'; COMMENT ON COLUMN "auth_sessions"."user_id" IS 'ID of the user to which the session belongs.'; COMMENT ON COLUMN "auth_sessions"."device" IS 'Fingerprint of the device to which the session belongs.'`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "auth_sessions" IS 'Contains authorization sessions.'`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_sessions" ADD CONSTRAINT "FK_50ccaa6440288a06f0ba693ccc6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_sessions" DROP CONSTRAINT "FK_50ccaa6440288a06f0ba693ccc6"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "auth_sessions" IS NULL`);
    await queryRunner.query(`DROP TABLE "auth_sessions"`);
  }
}
