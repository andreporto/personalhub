export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  created_at: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  url: string;
  category: string;
  notes?: string;
  created_at: string;
  related_projects?: string[]; // Array of project IDs
}

export type KanbanStatus = 'A Fazer' | 'Em Progresso' | 'Concluído';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: KanbanStatus;
  priority: 'Baixa' | 'Média' | 'Alta';
  task_order: number;
  due_date?: string;
  created_at: string;
}
