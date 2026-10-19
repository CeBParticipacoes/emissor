# frontend/src

- `pages/` — uma tela por arquivo. Só compõe componentes e chama hooks.
- `components/` — peças reutilizáveis (tabela de parcelas, badge de status, formulário).
- `api/` — um arquivo por recurso do backend (`auth.ts`, `contracts.ts`, `installments.ts`).
  Funções simples que usam `http.ts` e devolvem dados tipados.
- `hooks/` — hooks do React Query por cima de `api/` (`useContracts`, `useCreateContract`).

Sem Redux/Zustand: o React Query cuida do estado que vem do servidor; o resto é `useState`.
