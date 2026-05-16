# Design System

## Layout geral
- Sidebar fixa à esquerda (240px), colapsável
- Topbar com breadcrumb, busca global e avatar do usuário
- Área de conteúdo com padding 24px, max-width 1280px

## Componentes padrão
Sempre usar os componentes de /components/ui — nunca criar inline.

### Formulários
- Label sempre acima do campo
- Mensagem de erro logo abaixo do campo, em vermelho (text-red-500)
- Campos obrigatórios marcados com * vermelho
- Botão primário: azul, à direita; Cancelar: ghost, à esquerda

### Tabelas/Listas
- Sempre com coluna de ações no final (ícones: editar, excluir)
- Linha clicável leva ao detalhe
- Paginação no rodapé

### Modais
- Confirmação de exclusão: sempre modal, nunca confirm() do browser
- Título, descrição, botão "Excluir" (vermelho) e "Cancelar"

## Estados de tela obrigatórios
Todo módulo precisa tratar e exibir:
- Loading (skeleton, não spinner genérico)
- Empty state (ícone + mensagem + botão de ação primária)
- Error state (mensagem + botão de retry)
- Success (toast, não alert)
