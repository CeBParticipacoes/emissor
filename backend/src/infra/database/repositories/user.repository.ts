import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../domain/entities/user.js';
import type { UserRepository } from '../../../application/ports/repositories.js';
import { UserOrmEntity } from '../entities/user.entity.js';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { email },
    });

    return user ? this.toDomain(user) : null;
  }

  async save(user: User): Promise<void> {
    await this.repository.save(this.toOrm(user));
  }

  private toDomain(entity: UserOrmEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.passwordHash,
      entity.createdAt,
    );
  }

  private toOrm(user: User): UserOrmEntity {
    return Object.assign(new UserOrmEntity(), {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    });
  }
}