import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthChatMessageModel1763103428711 implements MigrationInterface {
  name = 'AddAuthChatMessageModel1763103428711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat_messages" ("id" SERIAL NOT NULL, "chat_id" integer NOT NULL, "chat_participant_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id")); COMMENT ON COLUMN "chat_messages"."id" IS 'The chat message ID.'; COMMENT ON COLUMN "chat_messages"."chat_id" IS 'ID of the chat to which the message belongs.'; COMMENT ON COLUMN "chat_messages"."chat_participant_id" IS 'ID of the participant who wrote the message.'; COMMENT ON COLUMN "chat_messages"."created_at" IS 'The time when the message was written.'; COMMENT ON COLUMN "chat_messages"."text" IS 'The message text.'`,
    );
    await queryRunner.query(`COMMENT ON TABLE "chat_messages" IS 'Contains chat messages.'`);
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_9f5c0b96255734666b7b4bc98c3" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_c512a42d9b39ffa41b26d1456c6" FOREIGN KEY ("chat_participant_id") REFERENCES "chat_participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_c512a42d9b39ffa41b26d1456c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_9f5c0b96255734666b7b4bc98c3"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "chat_messages" IS NULL`);
    await queryRunner.query(`DROP TABLE "chat_messages"`);
  }
}
