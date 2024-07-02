import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Authenticate1719462510236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'authenticate',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'access_token',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'refresh-token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'authenticate',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('authenticate');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    await queryRunner.dropForeignKey('authenticate', foreignKey);

    await queryRunner.dropTable('authenticate');
  }
}
