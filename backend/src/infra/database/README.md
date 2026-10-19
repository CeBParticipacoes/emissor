# infra/database — TypeORM

- `entities/` — classes com decorators do TypeORM (`@Entity`, `@Column`). São o **espelho das tabelas**,
  não as entidades do domínio. Nome: `contract.entity.ts`, `installment.entity.ts`...
- `repositories/` — implementam as portas de `application/ports/repositories.ts`.
  Cada um converte entidade ORM ↔ entidade de domínio (um `toDomain()` e um `toOrm()`).
- `migrations/` — geradas pela CLI. Nunca edite o banco na mão.

Tabelas (ver `docs/ARQUITETURA.md`): `users`, `customers`, `contracts`, `installments`, `notifications`.

TODO primeiro passo: criar as 5 entidades ORM e rodar `npm run migration:generate`.
