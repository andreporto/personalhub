-- 1. CRIAÇÃO DAS TABELAS (Caso não existam)
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

CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. HABILITAR RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 3. AJUSTE DE PERMISSÕES (POLICIES)

-- Remover políticas antigas para evitar duplicidade (Opcional, se estiver rodando novamente)
DROP POLICY IF EXISTS "Allow public read for projects" ON projects;
DROP POLICY IF EXISTS "Allow public read for knowledge" ON knowledge_base;
DROP POLICY IF EXISTS "Allow public read for kanban" ON kanban_tasks;
DROP POLICY IF EXISTS "Allow public insert for contacts" ON contacts;
DROP POLICY IF EXISTS "Allow auth all for projects" ON projects;
DROP POLICY IF EXISTS "Allow auth all for knowledge" ON knowledge_base;
DROP POLICY IF EXISTS "Allow auth all for kanban" ON kanban_tasks;
DROP POLICY IF EXISTS "Allow auth all for contacts" ON contacts;

-- PERMISSÕES PÚBLICAS (Visitantes)
CREATE POLICY "Allow public read for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read for knowledge" ON knowledge_base FOR SELECT USING (true);
CREATE POLICY "Allow public read for kanban" ON kanban_tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert for contacts" ON contacts FOR INSERT WITH CHECK (true);

-- PERMISSÕES PARA USUÁRIOS AUTENTICADOS (Você)
-- Projetos
CREATE POLICY "Allow auth all for projects" ON projects 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Conhecimento
CREATE POLICY "Allow auth all for knowledge" ON knowledge_base 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kanban
CREATE POLICY "Allow auth all for kanban" ON kanban_tasks 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contatos (Pode ver e deletar mensagens)
CREATE POLICY "Allow auth all for contacts" ON contacts 
FOR ALL TO authenticated USING (true) WITH CHECK (true);
