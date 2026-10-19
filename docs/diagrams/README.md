# Diagramas

Cada `.eraser` é um diagrama na sintaxe **diagram-as-code** do [Eraser.io](https://eraser.io).
A primeira linha de comentário diz o tipo (`cloud-architecture-diagram`, `flowchart-diagram`,
`sequence-diagram`, `entity-relationship-diagram`).

| Arquivo | Mostra |
|---|---|
| `01-arquitetura.eraser` | Quem fala com quem: painel, API, banco, Cora, Resend. |
| `02-fluxo-emissao.eraser` | A rotina diária que emite boletos. |
| `03-sequencia-webhook.eraser` | O que acontece quando o Cora avisa um pagamento. |
| `04-er.eraser` | As 5 tabelas e suas ligações. |
| `05-estados-parcela.eraser` | Os estados de uma parcela e as transições permitidas. |
| `06-camadas.eraser` | As camadas da Clean Architecture e as setas de dependência. |

## Como visualizar

1. Abra https://app.eraser.io, crie um arquivo, clique em **Diagram as code**.
2. Escolha o tipo indicado na primeira linha do arquivo.
3. Cole o conteúdo. O diagrama aparece na hora.
4. Exporte como PNG com o mesmo nome (`01-arquitetura.png` etc.) nesta pasta.
   A `ARQUITETURA.md` já referencia esses PNGs.

Os PNGs ainda não foram gerados. Até lá, os `.eraser` são a fonte.
