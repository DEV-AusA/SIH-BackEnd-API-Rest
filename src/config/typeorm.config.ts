import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  // host: 'postgresdb',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // dropSchema: true,
  synchronize: true,
  logging: true, // ["error"], <= solo muestre errores de la DB
  subscribers: [],
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  timestamp: 'timestamp-z',
};
// para el load: [typeormConfig] del module main
export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
