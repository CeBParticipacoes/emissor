import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * Usado pela CLI do TypeORM para gerar e rodar migrations:
 *   npm run migration:generate -- src/infra/database/migrations/NomeDaMudanca
 *   npm run migration:run
 *
 * `synchronize` fica SEMPRE false: mudança de banco só por migration versionada.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ['dist/infra/database/entities/*.entity.js'],
  migrations: ['dist/infra/database/migrations/*.js'],
});
