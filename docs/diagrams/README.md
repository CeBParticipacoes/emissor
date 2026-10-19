# Diagramas

Cada `.eraser` é um diagrama na sintaxe **diagram-as-code** do [Eraser.io](https://eraser.io).
A primeira linha de comentário diz o tipo (`cloud-architecture-diagram`, `flowchart-diagram`,
`sequence-diagram`, `entity-relationship-diagram`).

| Arquivo | Mostra | PNG | Eraser |
|---|---|---|---|
| `01-arquitetura.eraser` | Quem fala com quem: painel, API, banco, Cora, Resend. | [`01-arquitetura.png`](01-arquitetura.png) | [abrir](https://app.eraser.io/workspace/xHby9iynY8GcWeYGeZMj?diagram=fubV8DppSL8GG6Xw7emn&layout=canvas) |
| `02-fluxo-emissao.eraser` | A rotina diária que emite boletos. | [`02-fluxo-emissao.png`](02-fluxo-emissao.png) | [abrir](https://app.eraser.io/workspace/xHby9iynY8GcWeYGeZMj?diagram=j8zcDVMa7-0-LBqSl6TA&layout=canvas) |
| `03-sequencia-webhook.eraser` | O que acontece quando o Cora avisa um pagamento. | [`03-sequencia-webhook.png`](03-sequencia-webhook.png) | [abrir](https://app.eraser.io/workspace/xHby9iynY8GcWeYGeZMj?diagram=THluf7sfP0_O8jbrxpCm&layout=canvas) |
| `04-er.eraser` | As 5 tabelas e suas ligações. | [`04-er.png`](04-er.png) | [abrir](https://app.eraser.io/workspace/xHby9iynY8GcWeYGeZMj?diagram=xBsu2usVAafmxg9Tbe5J&layout=canvas) |
| `05-estados-parcela.eraser` | Os estados de uma parcela e as transições permitidas. | [`05-estados-parcela.png`](05-estados-parcela.png) | [abrir](https://app.eraser.io/workspace/xHby9iynY8GcWeYGeZMj?diagram=-d_43LrJWaQvHfuCantJ&layout=canvas) |
| `06-camadas.eraser` | As camadas da Clean Architecture e as setas de dependência. | [`06-camadas.png`](06-camadas.png) | [abrir](https://app.eraser.io/workspace/xHby9iynY8GcWeYGeZMj?diagram=AeVPzGboyamd4ZUNn5TT&layout=canvas) |

## Onde estão

Os 6 diagramas vivem num único arquivo do Eraser, **Emissor de Notas — Diagramas**:
https://app.eraser.io/workspace/xHby9iynY8GcWeYGeZMj

Os PNGs desta pasta foram exportados de lá e são os que `ARQUITETURA.md` mostra.

## Como atualizar

1. Edite o `.eraser` aqui (ele é a fonte).
2. Abra o diagrama pelo link da tabela, clique em **Diagram as code** e cole o conteúdo novo.
3. Exporte como PNG com o mesmo nome (`01-arquitetura.png` etc.) nesta pasta.
