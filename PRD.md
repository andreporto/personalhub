# PRD - Personal Hub & Portfolio (Alpha)

## 1. Visão Geral
Um ecossistema centralizado para gerenciar a identidade profissional (Portfólio), o aprendizado contínuo (Base de Conhecimento) e a produtividade (Kanban), com integração direta ao Supabase para persistência de dados e autenticação.

## 2. Objetivos
- **Exibir:** Projetos pessoais de forma atraente.
- **Organizar:** Links, notas e referências externas.
- **Planejar:** Gestão de estudos e metas via quadro Kanban.
- **Capturar:** Leads e mensagens através de um formulário de contato.
- **Proteger:** Painel administrativo restrito para gestão de conteúdo.

## 3. Personas
- **Visitante:** Recrutadores e outros desenvolvedores (vêem portfólio e blog/conhecimento).
- **Usuário (Proprietário):** Você (acesso total para gerenciar o sistema).

## 4. Requisitos Funcionais (RF)

### RF01: Portfólio de Projetos
- Listagem de projetos com imagem, descrição, tecnologias e links (GitHub/Live).
- Filtros por tags/tecnologias.

### RF02: Base de Conhecimento
- Cadastro de referências com título, URL, categoria e breve resumo.
- Sistema de busca global por palavras-chave.

### RF03: Planejador Kanban
- Colunas customizáveis (ex: Backlog, Em Estudo, Concluído).
- Cards com título, descrição, data de entrega e tags de prioridade.
- Funcionalidade Drag-and-Drop.

### RF04: Formulário de Contato
- Campos: Nome, Email, Assunto e Mensagem.
- Envio direto para a tabela `contacts` no Supabase.

### RF05: Autenticação e Autorização (Supabase Auth)
- Login restrito para o proprietário.
- Middleware para proteger rotas de criação/edição/deleção.

### RF06: Gestão de Conteúdo (CRUD Administrativo)
- Interface para Criar, Ler, Atualizar e Deletar (CRUD) Projetos.
- Interface para CRUD de itens da Base de Conhecimento.
- Interface para visualizar e gerenciar mensagens de contato recebidas.

## 5. Requisitos Não Funcionais (RNF)
- **Performance:** Carregamento rápido (Next.js com SSR/ISR).
- **Segurança:** Variáveis de ambiente protegidas e RLS (Row Level Security) no Supabase.
- **Design:** Interface moderna, responsiva, com suporte a Dark Mode.
- **Acessibilidade:** Seguindo práticas básicas de ARIA e contraste.

## 6. Arquitetura Técnica Proposta
- **Frontend:** Next.js (App Router) + TypeScript.
- **Estilização:** Vanilla CSS (CSS Modules ou Global Variables para alto desempenho).
- **Backend-as-a-Service:** Supabase (PostgreSQL, Auth, Storage).
- **Kanban Engine:** `@dnd-kit/core` ou `hello-pangea/dnd`.
- **Deploy:** Vercel ou Netlify.

## 7. Modelo de Dados (Supabase)
- `projects`: id, title, description, image_url, tech_stack[], github_url, live_url.
- `knowledge_base`: id, title, url, category, notes, created_at.
- `kanban_tasks`: id, title, description, status, priority, order, due_date.
- `contacts`: id, name, email, subject, message, created_at.

## 8. Plano de Execução (Milestones)

### Fase 1: Setup e Infraestrutura (Dia 1)
- [ ] Inicialização do projeto Next.js.
- [ ] Configuração do projeto no Supabase (Tabelas e Auth).
- [ ] Implementação do layout base e sistema de cores.

### Fase 2: Módulos Públicos (Dia 2-3)
- [ ] Landing Page e Portfólio (Leitura de dados).
- [ ] Base de Conhecimento (Busca e visualização).
- [ ] Formulário de Contato com validação.

### Fase 3: Administração e Kanban (Dia 4-5)
- [ ] Implementação do Login.
- [ ] Dashboard de CRUD (Create, Read, Update, Delete).
- [ ] Desenvolvimento do Quadro Kanban interativo.

### Fase 4: Polimento e Deploy (Dia 6)
- [ ] Otimização de SEO e imagens.
- [ ] Testes de segurança (RLS).
- [ ] Deploy final.
