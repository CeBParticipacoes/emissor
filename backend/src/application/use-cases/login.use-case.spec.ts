import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.js';
import { LoginUseCase } from './login.use-case.js';

describe('LoginUseCase', () => {
  const user = new User(
    'user-1',
    'Administrador',
    'admin@exemplo.com',
    bcrypt.hashSync('correct-password', 4),
    new Date('2026-11-18T00:00:00.000Z'),
  );

  function buildUseCase(foundUser: User | null) {
    const users = {
      findByEmail: vi.fn().mockResolvedValue(foundUser),
      save: vi.fn(),
    };

    return {
      useCase: new LoginUseCase(users),
      users,
    };
  }

  it('retorna o ID do usuário quando as credenciais são válidas', async () => {
    const { useCase, users } = buildUseCase(user);

    await expect(
      useCase.execute({
        email: 'admin@exemplo.com',
        password: 'correct-password',
      }),
    ).resolves.toEqual({ userId: 'user-1' });

    expect(users.findByEmail).toHaveBeenCalledWith('admin@exemplo.com');
  });

  it('rejeita quando o usuário não existe', async () => {
    const { useCase } = buildUseCase(null);

    await expect(
      useCase.execute({
        email: 'inexistente@exemplo.com',
        password: 'any-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejeita quando a senha está incorreta', async () => {
    const { useCase } = buildUseCase(user);

    await expect(
      useCase.execute({
        email: 'admin@exemplo.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});