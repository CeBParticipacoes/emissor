import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';

import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { DatabaseModule } from '../../infra/database/database.module.js';
import { ENV, type Env } from '../../infra/config/env.js';
import { EnvironmentModule } from '../../infra/config/environment.module.js';

import { AuthController } from './auth.controller.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Module({
  imports: [
    EnvironmentModule,
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [ENV],
      useFactory: (env: Env) => ({
        secret: env.JWT_SECRET,
        signOptions: {
          expiresIn: env.JWT_EXPIRES_IN as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
