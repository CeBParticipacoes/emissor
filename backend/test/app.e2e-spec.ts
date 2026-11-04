import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Health endpoint (e2e)', () => {
  let app: INestApplication<App> | undefined;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', async () => {
    await request(app!.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((response) => {
        if (response.body.status !== 'ok') {
          throw new Error('A resposta de saúde deveria ter status "ok"');
        }
      });
  });

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });
});