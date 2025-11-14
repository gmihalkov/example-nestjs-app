import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthChatModel1763102235054 implements MigrationInterface {
  name = 'AddAuthChatModel1763102235054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chats" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL, "ended_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id")); COMMENT ON COLUMN "chats"."id" IS 'The chat ID.'; COMMENT ON COLUMN "chats"."created_at" IS 'The time when the chat was created.'; COMMENT ON COLUMN "chats"."ended_at" IS 'The time when the chat was ended.'`,
    );
    await queryRunner.query(`COMMENT ON TABLE "chats" IS 'Contains the chats.'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON TABLE "chats" IS NULL`);
    await queryRunner.query(`DROP TABLE "chats"`);
  }
}
