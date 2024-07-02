import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAccessTokenCol1719382302793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'social_media_profile',
      new TableColumn({
        name: 'access_token',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('social_media_profile', 'access_token');
  }
}
