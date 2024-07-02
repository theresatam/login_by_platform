import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity1719379581828 } from './migrations/1719379581828-userEntity';
import { SMProfile1719380012261 } from './migrations/1719380012261-SMProfile';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'nestjs-login',
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
