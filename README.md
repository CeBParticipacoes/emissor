# Cobrança automática via Cora

Sistema interno que recebe um contrato parcelado uma vez e, a partir daí, emite cada boleto no Banco Cora sozinho, avisa o cliente por e-mail e registra o pagamento.

Comece por aqui:

1. [docs/ARQUITETURA.md](docs/ARQUITETURA.md) — o que o sistema faz e como é organizado.
2. [docs/GUIA-DO-DESENVOLVEDOR.md](docs/GUIA-DO-DESENVOLVEDOR.md) — como subir o ambiente e em que ordem construir.
3. [docs/diagrams/](docs/diagrams/) — diagramas (arquitetura, fluxos, banco, estados).

## Subir em 3 comandos

```bash
cp .env.example .env
docker compose up -d db
cd backend && npm install && npm run start:dev
```

Front: `cd frontend && npm install && npm run dev`.
