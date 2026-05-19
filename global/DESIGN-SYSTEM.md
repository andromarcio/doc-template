# DESIGN-SYSTEM.md
> Padrões de interface e componentes. Cole em sessões que envolvam
> criação ou alteração de telas.

---

## Layout geral

- **Sidebar**: fixa à esquerda, [largura]px, colapsável
- **Topbar**: breadcrumb + busca global + avatar do usuário
- **Área de conteúdo**: padding [valor]px; max-width [valor]px
- **Grid**: [descrever sistema de grid utilizado]

---

## Paleta de cores

| Token | Valor | Uso |
|---|---|---|
| `primary` | [ex: #2563EB] | Botão primário, links, destaques |
| `danger` | [ex: #DC2626] | Erros, exclusão, alertas críticos |
| `warning` | [ex: #D97706] | Avisos, atenção |
| `success` | [ex: #16A34A] | Confirmações, status positivo |
| `neutral` | [ex: #6B7280] | Textos secundários, bordas |

---

## Tipografia

| Elemento | Fonte | Tamanho | Peso |
|---|---|---|---|
| Título de página | [fonte] | [tamanho] | [peso] |
| Subtítulo | [fonte] | [tamanho] | [peso] |
| Corpo | [fonte] | [tamanho] | [peso] |
| Label de campo | [fonte] | [tamanho] | [peso] |
| Mensagem de erro | [fonte] | [tamanho] | [peso] |

---

## Componentes padrão

> Sempre usar componentes de `/components/ui` — nunca criar inline.

### Botões
| Variante | Uso | Posição padrão |
|---|---|---|
| Primary | Ação principal da tela | Direita do rodapé do formulário |
| Secondary | Ação secundária | À esquerda do Primary |
| Ghost / Cancel | Cancelar ou descartar | À esquerda do Secondary |
| Danger | Excluir, desativar | Separado das demais ações |

### Formulários
- Label sempre **acima** do campo
- Campos obrigatórios marcados com `*` na cor `danger`
- Mensagem de erro exibida **abaixo** do campo, na cor `danger`
- Placeholder apenas para exemplificar formato — nunca substituir label
- Campos desabilitados com opacidade reduzida e cursor `not-allowed`

### Tabelas e listas
- Coluna de ações sempre na **última coluna** (ícones: editar, excluir)
- Linha clicável leva ao detalhe do registro
- Linha com hover em cor `neutral` suave
- Paginação no **rodapé** da tabela

### Modais
- Confirmação de exclusão: **sempre modal** — nunca `confirm()` nativo
- Estrutura: título + descrição + botão de ação (danger) + botão cancelar
- Fechar modal com ESC ou clique fora da área
- Máximo de [largura]px de largura

### Toasts / Notificações
- Posição: [ex: canto superior direito]
- Duração: [ex: 5 segundos] para sucesso; [ex: persistente] para erro
- Nunca usar `alert()` nativo

---

## Estados obrigatórios de tela

Todo módulo deve tratar e exibir os quatro estados abaixo.
Nunca deixar a tela em branco ou congelada.

### Loading
- Usar **skeleton** no lugar do conteúdo que está carregando
- Nunca usar spinner genérico isolado no centro da tela
- Blocos de skeleton devem ter a mesma proporção do conteúdo real

### Empty state
- Ícone ilustrativo (não genérico)
- Título: o que não foi encontrado
- Descrição: por que está vazio ou o que o usuário pode fazer
- Botão de ação primária quando aplicável (ex: "Criar primeiro contato")

### Error state
- Ícone de erro
- Mensagem descritiva (não "Erro 500")
- Botão "Tentar novamente" que re-executa a última operação

### Success
- Toast com mensagem de confirmação
- Nunca redirecionar sem feedback visual

---

## Padrões de navegação

- Breadcrumb atualizado em toda navegação
- URL sempre reflete o estado atual da tela (filtros, tabs, modal aberto)
- Botão Voltar do browser deve funcionar corretamente
- Links externos sempre abrem em nova aba (`target="_blank"`)

---

## Acessibilidade (mínimo obrigatório)

- Todo campo de formulário com `label` associado via `for`/`id`
- Imagens com `alt` descritivo
- Ícones de ação com `aria-label`
- Contraste mínimo de 4.5:1 para textos
- Navegação completa por teclado em formulários e modais
