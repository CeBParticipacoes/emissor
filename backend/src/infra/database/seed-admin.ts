import { randomUUID } from 'node:crypto';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AppDataSource } from './data-source.js';
import { UserOrmEntity } from './entities/user.entity.js';
import { loadEnv } from '../config/env.js';

const logger = new Logger('SeedAdmin');

async function seedAdmin(): Promise<void> {
  const env = loadEnv();

  await AppDataSource.initialize();

  try {
    const users = AppDataSource.getRepository(UserOrmEntity);

    const existingUser = await users.findOne({
      where: { email: env.ADMIN_EMAIL },
    });

    if (existingUser) {
      logger.log('Administrador já cadastrado.');
      return;
    }

    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

    const admin = users.create({
      id: randomUUID(),
      name: 'Administrador',
      email: env.ADMIN_EMAIL,
      passwordHash,
      createdAt: new Date(),
    });

    await users.save(admin);

    logger.log('Administrador criado com sucesso.');
  } finally {
    await AppDataSource.destroy();
  }
}

seedAdmin().catch((error: unknown) => {
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger.error(
    'Falha ao executar o cadastro do administrador.',
    errorStack,
  );

  process.exitCode = 1;
});