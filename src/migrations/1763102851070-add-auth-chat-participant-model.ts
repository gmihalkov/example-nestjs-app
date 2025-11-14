import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthChatParticipantModel1763102851070 implements MigrationInterface {
  name = 'AddAuthChatParticipantModel1763102851070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat_participants" ("id" SERIAL NOT NULL, "chat_id" integer NOT NULL, "user_id" integer NOT NULL, "is_creator" boolean NOT NULL, "is_admin" boolean NOT NULL, CONSTRAINT "PK_ebf68c52a2b4dceb777672b782d" PRIMARY KEY ("id")); COMMENT ON COLUMN "chat_participants"."id" IS 'The chat participant ID.'; COMMENT ON COLUMN "chat_participants"."chat_id" IS 'ID of the chat to which the participant belongs.'; COMMENT ON COLUMN "chat_participants"."user_id" IS 'ID of the user which the participant is.'; COMMENT ON COLUMN "chat_participants"."is_creator" IS 'Indicates if the participant is a chat''s creator.'; COMMENT ON COLUMN "chat_participants"."is_admin" IS 'Indicates if the participant is a chat''s administrator.'`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "chat_participants" IS 'Contains the chat participants.'`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_9946d299e9ccfbee23aa40c5545" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_b4129b3e21906ca57b503a1d834" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_b4129b3e21906ca57b503a1d834"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_9946d299e9ccfbee23aa40c5545"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "chat_participants" IS NULL`);
    await queryRunner.query(`DROP TABLE "chat_participants"`);
  }
}
