import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY, type UserRepository } from '../ports/repositories.js';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: {
    email: string;
    password: string;
  }): Promise<{ userId: string }> {
    const user = await this.users.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordIsValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return { userId: user.id };
  }
}