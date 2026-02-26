# 📋 Plano de Implementação - Personal Hub (Fase Beta)

## 1. Status Atual (Checklist)
- [x] Landing Page Base (Next.js + Tailwind/Vanilla CSS)
- [x] Listagem de Projetos (CRUD Leitura)
- [x] Base de Conhecimento (Busca + Filtros)
- [x] Quadro Kanban (Interface Drag-and-Drop)
- [x] **Command Center (Busca Global CMD+K)** - *Implementado*
- [x] **Live Status ("O que estou fazendo agora")** - *Implementado*
- [x] Autenticação Básica (Supabase Auth)
- [x] **Persistência de Dados (Escrita/Admin)** - *Implementado*
- [x] **Dashboard Administrativo Completo** - *Implementado*
- [x] **Gestão de Mídias (Supabase Storage)** - *Implementado*
- [x] **Arquitetura de Dados Relacional** - *Implementado*

---

## 2. Próximas Etapas de Implementação

### Fase A: Persistência e Segurança (Backend) - [CONCLUÍDO]
**Objetivo:** Garantir que as alterações feitas no Kanban e no Admin sejam salvas corretamente no banco de dados.
*   [x] **Implementação de RLS (Row Level Security):** Políticas configuradas no Supabase.
*   [x] **Sync Automático do Kanban:** Implementado no componente KanbanBoard.
*   [x] **Tabela de Atividades:** Criada migração `migrations/01_activity_log.sql`.
*   [x] **Log de Atividades:** Integrado no Kanban ao concluir tarefas.

### Fase B: Dashboard Administrativo (UX de Gestão) - [CONCLUÍDO]
**Objetivo:** Criar uma interface centralizada para gerenciar o conteúdo sem precisar acessar o painel do Supabase.
*   [x] **Página `/admin/projects`:** Formulário com suporte a upload de imagens via Supabase Storage.
*   [x] **Página `/admin/knowledge`:** Registro de atividades ao adicionar novas referências.
*   [x] **Inbox de Contatos:** Sistema de "Marcar como lida" e indicadores visuais de novas mensagens.
*   [x] **Log de Atividades:** Integrado em todos os módulos administrativos.

### Fase C: Arquitetura de Dados Relacional (O Diferencial) - [CONCLUÍDO]
**Objetivo:** Conectar as entidades para criar o "Grafo de Conhecimento".
*   [x] **Relacionamento `Project <-> Knowledge`:** Criada tabela de junção e lógica de persistência.
*   [x] **Visualização Relacional:** `ProjectCard` agora exibe estudos vinculados, demonstrando autoridade técnica.
*   [x] **Admin Integrado:** `KnowledgeManager` permite vincular projetos às notas.

---

## 3. Cronograma Técnico Sugerido (Concluído)

As tarefas de infraestrutura, Admin UI, Kanban Sync e Data Enrichment foram finalizadas. O sistema está pronto para produção.

---

## 4. Sugestões de Melhorias de Código (Refatoração)
1.  **TanStack Query:** Migrar as chamadas de API para `useQuery`.
2.  **Shared Types:** Expandir a interface `KanbanTask`.
3.  **Toasts de Notificação:** Adicionar `react-hot-toast` para feedback de ações.
