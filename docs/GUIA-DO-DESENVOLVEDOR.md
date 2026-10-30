# Guia do desenvolvedor

Este guia é para quem vai **construir** o sistema. Pressupõe que você leu a [ARQUITETURA.md](ARQUITETURA.md).

## 1. Subir o ambiente

Precisa de: Node 20+, Docker Desktop, Git.

```bash
cp .env.example .env            # edite JWT_SECRET, EMAIL_FROM, INTERNAL_ALERT_EMAIL
docker compose up -d db         # só o Postgres, por enquanto
cd backend && npm install && npm run start:dev
```

Abra http://localhost:3000/health. Deve responder `{"status":"ok"}`.

Front, em outro terminal:

```bash
cd frontend && npm install && npm run dev
```

Testes do backend: `cd backend && npm test`.

> Se `npm install` falhar com `Cannot read properties of null (reading 'edgesOut')`, é um bug do npm 10.8. Use `npx npm@latest install`.

## 2. Como o repositório está organizado

```
.
├── docker-compose.yml   # db + api
├── .env.example         # todas as variáveis, comentadas
├── backend/             # NestJS (ver src/*/README.md em cada camada)
├── frontend/            # React + Vite (ver src/README.md)
└── docs/                # este guia, a arquitetura, os diagramas
```

Procure por `TODO` no código: cada um diz o que fazer e, muitas vezes, como. Comece pelos de dentro para fora.

## 3. Ordem sugerida de construção

Cada etapa termina com algo rodando e testado. Não pule para a próxima com a anterior pela metade.

### Etapa 1 — Domínio (sem banco, sem Cora)
- [ ] `Document.parse`: validar dígitos verificadores de CPF e CNPJ. Teste primeiro.
- [ ] `Installment`: implementar `markIssued`, `markIssueFailed`, `markPaid`, `markOverdue`, `cancel`. Um teste por transição permitida e um por transição proibida.
- [ ] `Contract.cancel` e `Contract.markCompleted`.
- Pronto quando: `npm test` verde e você consegue explicar cada estado da parcela sem olhar.

### Etapa 2 — Banco
- [ ] Criar as 5 entidades ORM em `infra/database/entities/`.
- [ ] `npm run migration:generate -- src/infra/database/migrations/CreateTables` e `npm run migration:run`.
- [ ] Implementar os repositórios em `infra/database/repositories/`, cada um com `toDomain()` / `toOrm()`.
- [ ] Ligar `TypeOrmModule.forRoot` no `AppModule` e registrar `{ provide: CONTRACT_REPOSITORY, useClass: ... }`.
- Pronto quando: um teste de integração salva um contrato com parcelas e lê de volta.

### Etapa 3 — Login
- [ ] `LoginUseCase` com bcrypt.
- [ ] `presentation/auth`: `POST /auth/login` devolve JWT; `JwtAuthGuard`.
- [ ] Script `seed-admin.ts` que cria o usuário de `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
- Pronto quando: `curl -X POST localhost:3000/auth/login` devolve um token e `GET /contracts` sem token dá 401.

### Etapa 4 — Criar contrato
- [ ] `CreateContractUseCase` (teste com repositórios fake em memória primeiro).
- [ ] `presentation/contracts`: DTO com `class-validator`, `POST /contracts`, `GET /contracts`, `GET /contracts/:id`.
- Pronto quando: cadastrar um contrato 12x pelo curl cria 12 parcelas `PENDING` no banco.

### Etapa 5 — Cora
- [ ] Conseguir certificado + client_id de **stage** (pedir a quem contratou o Cora Pro).
- [ ] `CoraAuthService`: pega o token com mTLS e guarda em memória até expirar.
- [ ] `CoraBankGateway.issueInvoice`, `getInvoiceStatus`, `cancelInvoice`.
- [ ] `IssueDueInstallmentsUseCase` (teste com `BankGateway` fake primeiro).
- [ ] Endpoint `POST /admin/run-daily-jobs` só em development, para rodar o cron na mão.
- Pronto quando: rodar o cron na mão emite boletos de verdade no stage e você vê o PDF.

### Etapa 6 — Webhook
- [ ] `presentation/webhooks`: `POST /webhooks/cora`, sem guard.
- [ ] `HandleCoraWebhookUseCase`.
- [ ] Expor sua máquina com `cloudflared tunnel --url http://localhost:3000` (ou ngrok) e cadastrar a URL no Cora.
- Pronto quando: "pagar boleto em stage" faz a parcela virar `PAID` no banco.

### Etapa 7 — E-mails
- [ ] Conta no Resend, domínio verificado (pode levar dias; comece cedo), `RESEND_API_KEY`.
- [ ] `ResendEmailSender`. Textos simples em português em `infra/email/templates.ts`.
- [ ] `SendRemindersUseCase` + tabela/porta `notifications`.
- Pronto quando: você recebe os 4 e-mails (emitido, lembrete, atraso, pago) na sua caixa.

### Etapa 8 — Cancelamento e falhas
- [ ] `CancelContractUseCase` + `POST /contracts/:id/cancel`.
- [ ] `POST /installments/:id/retry`.
- [ ] E-mail interno quando parcela vira `ISSUE_FAILED`.

### Etapa 9 — Front
- [ ] Login → guarda token → rotas protegidas.
- [ ] Lista de contratos, novo contrato (react-hook-form + zod), detalhe com tabela de parcelas e links do boleto.
- [ ] Destaque para `ISSUE_FAILED` e `OVERDUE`.

### Etapa 10 — Produção
- [ ] EC2 com Docker. Clonar repo, `.env` de produção, pasta `certs/` com certificado de **produção**.
- [ ] `docker compose up -d --build`. Domínio + HTTPS (Caddy ou nginx) na frente da API.
- [ ] Cadastrar a URL pública do webhook no Cora (produção).
- [ ] Agendar `pg_dump` diário.

## 4. Regras do código

1. **Dinheiro em centavos, inteiro.** Nunca `number` com vírgula.
2. **Domain não importa framework.** Se precisou de `@nestjs/...` dentro de `domain/`, está no lugar errado.
3. **Use-case fala só com portas.** Se o use-case importou `typeorm` ou `axios`, está errado.
5. **Banco só muda por migration.**
6. **Nomes dizem o que fazem.** `markPaid`, não `update`. `findPendingDueUntil`, não `query2`.
7. **Um controller chama um use-case.** Sem regra de negócio no controller.
8. **Falha de uma parcela não derruba as outras.** `try/catch` dentro do loop.

## 5. Glossário

- **Boleto registrado** — boleto cadastrado no banco emissor; é o único tipo que o Cora emite.
- **Carnê** — vários boletos emitidos de uma vez. Não usamos.
- **Clean Architecture** — organizar o código em camadas onde a regra de negócio não depende de banco, framework ou API externa.
- **Cron** — tarefa que roda sozinha num horário. Aqui, `@nestjs/schedule`, todo dia às 06:00.
- **DTO** — objeto que descreve o formato de entrada/saída de um endpoint. Validado com `class-validator`.
- **Idempotência** — fazer a mesma operação duas vezes dá o mesmo resultado que fazer uma. Essencial em pagamentos.
- **JWT** — token assinado que prova que o usuário fez login. Vai no header `Authorization: Bearer ...`.
- **Migration** — arquivo versionado que altera o banco. Permite reproduzir o banco em qualquer máquina.
- **mTLS** — TLS onde o cliente também apresenta certificado. É como o Cora sabe que somos nós.
- **Porta / adaptador** — interface que o use-case precisa / classe que a implementa de verdade.
- **Stage** — ambiente de testes do Cora. Boletos falsos, dinheiro falso.
- **Value object** — tipo pequeno, imutável, com validação (`Money`, `Document`, `DueDay`).
- **Webhook** — o Cora chama a nossa URL quando algo acontece, em vez de a gente ficar perguntando.
