# domain/ — o coração do sistema

Aqui vivem as **regras de negócio**: o que é um contrato, como as parcelas são
calculadas, quais mudanças de status são permitidas.

Regra de ouro: **nada aqui importa Nest, TypeORM, axios ou qualquer biblioteca**.
Só TypeScript puro. Assim dá para testar tudo sem banco, sem internet, sem framework.

- `value-objects/` — tipos pequenos com validação embutida (`Money`, `Document`, `DueDay`).
  Um value object é imutável e se define pelo valor, não por um id.
- `entities/` — as coisas que têm identidade e ciclo de vida (`Contract`, `Installment`...).
- `services/` — regras que envolvem mais de uma entidade (`InstallmentScheduleCalculator`).
- `errors/` — erros de negócio, para a camada de fora transformar em HTTP 400/409.
