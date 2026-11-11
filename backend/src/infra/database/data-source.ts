import { config } from 'dotenv';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';

import { loadEnv } from '../config/env.js';
import { ORM_ENTITIES } from './entities/orm-entities.js';

config({ path: resolve(process.cwd(), '../.env') });

const env = loadEnv();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  entities: ORM_ENTITIES,
  migrations: ['dist/infra/database/migrations/*.js'],
});