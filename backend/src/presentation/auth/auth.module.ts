import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ENV, type Env } from '../../infra/config/env.js';
import { EnvironmentModule } from '../../infra/config/environment.module.js';

import type { StringValue } from 'ms';

@Module({
  imports: [
    EnvironmentModule,
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
  exports: [JwtModule],
})
export class AuthModule {}