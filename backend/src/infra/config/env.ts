import { z } from 'zod';

/**
 * Lê e valida o .env UMA vez, no boot. Se faltar algo, o app nem sobe,
 * com mensagem clara. Melhor do que descobrir às 06:00 quando o cron rodar.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().default(3000),
  COMPANY_NAME: z.string().default('Minha Empresa'),

  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET precisa ter pelo menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().default('8h'),

  CORA_BASE_URL: z.string().url(),
  CORA_TOKEN_URL: z.string().url(),
  CORA_CLIENT_ID: z.string().default(''),
  CORA_CERT_PATH: z.string().default('/certs/certificate.pem'),
  CORA_KEY_PATH: z.string().default('/certs/private-key.key'),

  ISSUE_DAYS_BEFORE_DUE: z.coerce.number().default(10),
  REMINDER_DAYS_BEFORE_DUE: z.coerce.number().default(3),
  OVERDUE_NOTICE_DAYS_AFTER_DUE: z.coerce.number().default(1),
  MAX_ISSUE_ATTEMPTS: z.coerce.number().default(3),

  RESEND_API_KEY: z.string().default(''),
  EMAIL_FROM: z.string().email(),
  INTERNAL_ALERT_EMAIL: z.string().email(),
});

export type Env = z.infer<typeof schema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = schema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Variáveis de ambiente inválidas:\n${problems}`);
  }
  return result.data;
}

export const ENV = Symbol('Env');
