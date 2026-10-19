# presentation/ — a porta de entrada HTTP

Controllers recebem a requisição, validam o formato (DTO com `class-validator`),
chamam **um** use-case e devolvem a resposta. Nada de regra de negócio aqui.

Pastas (uma por recurso), cada uma com `*.module.ts`, `*.controller.ts` e `dto/`:

- `auth/` — `POST /auth/login` → `LoginUseCase` → gera JWT. `JwtAuthGuard` protege o resto.
- `contracts/` — `GET /contracts`, `POST /contracts`, `GET /contracts/:id`, `POST /contracts/:id/cancel`.
- `installments/` — `POST /installments/:id/retry` (zera tentativas de emissão).
- `webhooks/` — `POST /webhooks/cora`. **Sem** JwtAuthGuard (quem chama é o Cora).
  Lê os headers `webhook-event-type` e `webhook-resource-id` e chama `HandleCoraWebhookUseCase`.
  Responde 200 rápido; se der erro interno, loga e ainda responde 200 para o Cora não ficar reenviando.
- `health/` — `GET /health`, usado pelo docker e por você para saber que subiu.

Só em `NODE_ENV=development`: `POST /admin/run-daily-jobs` para disparar o cron na mão.
