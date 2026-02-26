CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_config',
  theme_id TEXT DEFAULT 'default',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir configuração inicial se não existir
INSERT INTO site_settings (id, theme_id) 
VALUES ('global_config', 'default')
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Leitura pública para que qualquer visitante veja o tema correto
CREATE POLICY "Allow public read for site_settings" ON site_settings FOR SELECT USING (true);

-- Apenas usuários autenticados (você) podem alterar o tema
CREATE POLICY "Allow auth all for site_settings" ON site_settings 
FOR ALL TO authenticated USING (true) WITH CHECK (true);
