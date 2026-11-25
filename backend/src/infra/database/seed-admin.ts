import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

import { AppDataSource } from './data-source.js';
import { UserOrmEntity } from './entities/user.entity.js';
import { loadEnv } from '../config/env.js';

async function seedAdmin(): Promise<void> {
  const env = loadEnv();

  await AppDataSource.initialize();

  try {
    const users = AppDataSource.getRepository(UserOrmEntity);

    const existingUser = await users.findOne({
      where: { email: env.ADMIN_EMAIL },
    });

    if (existingUser) {
      console.log('Administrador já cadastrado.');
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

    console.log('Administrador criado com sucesso.');
  } finally {
    await AppDataSource.destroy();
  }
}

seedAdmin().catch(() => {
  console.error('Falha ao executar o cadastro do administrador.');
  process.exitCode = 1;
});