import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class SMProfile1719380012261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'social_media_profile',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'platform_id',
            type: 'varchar',
          },
          {
            name: 'platform',
            type: 'varchar',
          },
          {
            name: 'access_token',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'social_media_profile',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'social_media_profile',
      'FK_socialmediaprofile_user',
    );
    await queryRunner.dropTable('social_media_profile');
  }
}
