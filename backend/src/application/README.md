# application/ — os casos de uso

Cada arquivo em `use-cases/` é **uma ação que o sistema faz**: criar contrato,
emitir parcelas vencendo, tratar webhook do Cora. Um use-case:

1. recebe um `input` simples (objeto TS),
2. usa as entidades do `domain/` para aplicar regras,
3. fala com o mundo externo **só através de portas** (`ports/`),
4. devolve um `output` simples.

Uma **porta** é uma interface: "preciso de alguém que salve contratos",
"preciso de alguém que emita boleto". Quem implementa está em `infra/`.
Isso permite testar o use-case com um fake em memória, sem banco e sem Cora.

Ordem sugerida para implementar: `Login` → `CreateContract` → `IssueDueInstallments`
→ `HandleCoraWebhook` → `SendReminders` → `CancelContract`.
