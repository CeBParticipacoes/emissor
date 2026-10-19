import { config as loadDotenv } from 'dotenv';
// Procura o .env na raiz do repositório (rodando de backend/) ou na pasta atual (docker).
loadDotenv({ path: ['../.env', '.env'] });
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Rejeita campos desconhecidos e converte tipos nos DTOs (class-validator).
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(process.env.API_PORT ?? 3000);
}
await bootstrap();
