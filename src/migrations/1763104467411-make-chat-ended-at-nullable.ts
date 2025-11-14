import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeChatEndedAtNullable1763104467411 implements MigrationInterface {
  name = 'MakeChatEndedAtNullable1763104467411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chats" ALTER COLUMN "ended_at" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chats" ALTER COLUMN "ended_at" SET NOT NULL`);
  }
}
