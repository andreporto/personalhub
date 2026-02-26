-- Tabela de junção para relacionamento Muitos-para-Muitos
CREATE TABLE IF NOT EXISTS project_knowledge (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  knowledge_id UUID REFERENCES knowledge_base(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, knowledge_id)
);

-- RLS
ALTER TABLE project_knowledge ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Allow public read for project_knowledge" ON project_knowledge FOR SELECT USING (true);

-- Auth all
CREATE POLICY "Allow auth all for project_knowledge" ON project_knowledge 
FOR ALL TO authenticated USING (true) WITH CHECK (true);
