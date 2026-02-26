-- ==========================================
-- SETUP COMPLETO - PERSONAL HUB & PORTFOLIO
-- ==========================================

-- 1. CRIAÇÃO DAS TABELAS

-- Projetos
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Base de Conhecimento
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Junção (Relacionamento Projetos <-> Conhecimento)
CREATE TABLE IF NOT EXISTS project_knowledge (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  knowledge_id UUID REFERENCES knowledge_base(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, knowledge_id)
);

-- Kanban
CREATE TABLE IF NOT EXISTS kanban_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'A Fazer',
  priority TEXT DEFAULT 'Média',
  task_order SERIAL,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Contatos
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Log de Atividades
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'project', 'knowledge', 'kanban'
  action TEXT NOT NULL, -- 'create', 'complete', 'study'
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurações do Site (Temas)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_config',
  theme_id TEXT DEFAULT 'default',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir configuração inicial de tema
INSERT INTO site_settings (id, theme_id) 
VALUES ('global_config', 'default')
ON CONFLICT (id) DO NOTHING;


-- 2. HABILITAR RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;


-- 3. AJUSTE DE PERMISSÕES (POLICIES)

-- Limpeza de políticas antigas
DO $$ 
BEGIN
    EXECUTE (SELECT 'DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON ' || quote_ident(tablename) 
             FROM pg_policies WHERE schemaname = 'public');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- PERMISSÕES PÚBLICAS (Leitura e Inserção de Contatos)
CREATE POLICY "Allow public read for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read for knowledge" ON knowledge_base FOR SELECT USING (true);
CREATE POLICY "Allow public read for project_knowledge" ON project_knowledge FOR SELECT USING (true);
CREATE POLICY "Allow public read for kanban" ON kanban_tasks FOR SELECT USING (true);
CREATE POLICY "Allow public read for activity_log" ON activity_log FOR SELECT USING (true);
CREATE POLICY "Allow public read for site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert for contacts" ON contacts FOR INSERT WITH CHECK (true);

-- PERMISSÕES PARA USUÁRIOS AUTENTICADOS (Gerenciamento Total)
CREATE POLICY "Allow auth all for projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all for knowledge" ON knowledge_base FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all for project_knowledge" ON project_knowledge FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all for kanban" ON kanban_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all for contacts" ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all for activity_log" ON activity_log FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all for site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
