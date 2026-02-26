# 🚀 Personal Hub & Digital Garden

O **Personal Hub** é um ecossistema centralizado projetado para desenvolvedores que desejam gerenciar sua identidade profissional (Portfólio), organizar seu aprendizado contínuo (Base de Conhecimento) e planejar sua produtividade (Kanban), tudo em uma interface moderna e ultra-rápida.

## ✨ Funcionalidades Principais

-   **💼 Portfólio Dinâmico:** Listagem de projetos com tags de tecnologias e links.
-   **🌿 Digital Garden (Knowledge Base):** Organize links, notas e estudos com filtros por categoria.
-   **📋 Planejador Kanban:** Gerencie suas tarefas com interface Drag-and-Drop persistente.
-   **⌨️ Command Center (CMD+K):** Busca global instantânea para navegação rápida entre projetos e notas.
-   **🎨 Sistema de Temas Global:** 13 paletas de cores (incluindo temas Brasil e Québec) sincronizadas via Supabase.
-   **🔐 Painel Administrativo:** CRUD completo para todos os conteúdos, incluindo upload de imagens para o Supabase Storage.
-   **📈 Live Status:** Seção dinâmica que mostra no que você está trabalhando e aprendendo agora.

## 🛠️ Stack Técnica

-   **Frontend:** [Next.js 15+](https://nextjs.org/) (App Router)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilização:** Vanilla CSS (Modern CSS Variables & Keyframes)
-   **Backend:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, RLS)
-   **Testes:** [Vitest](https://vitest.dev/) & React Testing Library
-   **Ícones:** [Lucide React](https://lucide.dev/)

## 🚀 Instalação e Configuração Local

### 1. Clonar o repositório
```bash
git clone <seu-repositorio>
cd landing-pages
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### 4. Preparar o Banco de Dados
Execute os scripts SQL encontrados na pasta `migrations/` e o arquivo `setup_supabase.sql` no console SQL do seu projeto Supabase para criar as tabelas e políticas de segurança (RLS).

### 5. Rodar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

## 🧪 Testes

Para garantir que tudo esteja funcionando, execute a suíte de testes automatizados:
```bash
npm test
```

## 📦 Build e Deploy

### Empacotamento
Para gerar a versão otimizada para produção:
```bash
npm run build
```

### Deploy na Vercel
O projeto está pronto para ser hospedado na [Vercel](https://vercel.com/):

1. Conecte seu repositório GitHub à Vercel.
2. Adicione as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) nas configurações do projeto na Vercel.
3. A Vercel detectará automaticamente o Next.js e fará o deploy a cada `git push`.

## 📖 Como Usar

### Acesso Administrativo
Para gerenciar seus projetos e notas:
1. Vá para `/login`.
2. Use seu e-mail e senha cadastrados no Supabase Auth.
3. Acesse `/admin` para usar o dashboard.

### Atalhos de Teclado
-   **CMD + K (ou CTRL + K):** Abre a barra de busca global em qualquer página.
-   **ESC:** Fecha modais ou o Command Center.

## 📁 Estrutura do Projeto
- `src/app`: Rotas e páginas (App Router).
- `src/components`: Componentes React modulares.
- `src/lib`: Configurações de bibliotecas externas (Supabase).
- `src/styles`: Estilos globais e variáveis de tema.
- `src/test`: Suíte de testes automatizados.
- `migrations/`: Scripts SQL para o banco de dados.

---
© 2026 Desenvolvido com foco em performance e elegância técnica.
