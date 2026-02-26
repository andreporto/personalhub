CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'project', 'knowledge', 'kanban'
  action TEXT NOT NULL, -- 'create', 'complete', 'study'
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Allow public read for activity_log" ON activity_log FOR SELECT USING (true);

-- Auth all
CREATE POLICY "Allow auth all for activity_log" ON activity_log 
FOR ALL TO authenticated USING (true) WITH CHECK (true);
