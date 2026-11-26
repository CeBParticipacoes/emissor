import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { USER_REPOSITORY, type UserRepository } from '../ports/repositories.js';

const DUMMY_PASSWORD_HASH = bcrypt.hashSync('dummy-password', 12);

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

    const passwordIsValid = await bcrypt.compare(
      input.password,
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !passwordIsValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return { userId: user.id };
  }
}