import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, type UserRepository } from '../ports/repositories.js';

@Injectable()
export class LoginUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  async execute(_input: { email: string; password: string }): Promise<{ userId: string }> {
    // TODO: users.findByEmail(); bcrypt.compare(password, user.passwordHash).
    // Se falhar, lance o MESMO erro para "usuário não existe" e "senha errada" (não vaze qual foi).
    // A geração do JWT fica na presentation/auth, não aqui.
    throw new Error('TODO: LoginUseCase');
  }
}
