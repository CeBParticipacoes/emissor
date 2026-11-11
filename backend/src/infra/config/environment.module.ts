import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { resolve } from 'node:path';

import { ENV, loadEnv } from './env.js';

config({ path: [resolve(process.cwd(), '../.env'), '.env'] });

@Module({
  providers: [
    {
      provide: ENV,
      useFactory: () => loadEnv(),
    },
  ],
  exports: [ENV],
})
export class EnvironmentModule {}