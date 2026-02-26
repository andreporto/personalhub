'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { KanbanTask, KanbanStatus } from '@/types'
import { Plus, Trash2, Edit2, X, Save, Calendar, Flag } from 'lucide-react'
import KanbanBoard from '@/components/KanbanBoard'

export default function KanbanManager() {
  const [tasks, setTasks] = useState<KanbanTask[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'A Fazer' as KanbanStatus,
    priority: 'Média' as 'Baixa' | 'Média' | 'Alta',
    due_date: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    setLoading(true)
    const { data } = await supabase.from('kanban_tasks').select('*').order('task_order', { ascending: true })
    if (data) {
      setTasks(data)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    let result;
    if (editingId) {
      result = await supabase.from('kanban_tasks').update(formData).eq('id', editingId)
    } else {
      // Pega a última ordem para inserir no fim
      const lastOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.task_order)) : 0
      result = await supabase.from('kanban_tasks').insert([{ ...formData, task_order: lastOrder + 1 }])
    }

    if (result.error) {
      alert('Erro ao salvar tarefa: ' + result.error.message)
    } else {
      resetForm()
      fetchTasks()
    }
    setLoading(false)
  }

  function handleEdit(task: KanbanTask) {
    setEditingId(task.id)
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || ''
    })
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (confirm('Excluir esta tarefa?')) {
      const { error } = await supabase.from('kanban_tasks').delete().eq('id', id)
      if (error) alert('Erro ao deletar: ' + error.message)
      fetchTasks()
    }
  }

  function resetForm() {
    setFormData({ title: '', description: '', status: 'A Fazer', priority: 'Média', due_date: '' })
    setEditingId(null)
    setShowForm(false)
  }

  async function handleTasksChange(newTasks: KanbanTask[]) {
    setTasks(newTasks)
    
    // Identifica qual tarefa mudou para persistir (ou simplifica salvando a ordem de todas)
    // Para garantir consistência na ordem, salvamos a ordem de todas as tarefas afetadas
    const updates = newTasks.map((task, index) => 
      supabase.from('kanban_tasks').update({
        status: task.status,
        task_order: index
      }).eq('id', task.id)
    )
    await Promise.all(updates)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Gestão do Kanban</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setShowForm(!showForm)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {showForm ? <><X size={18} /> Cancelar</> : <><Plus size={18} /> Nova Tarefa</>}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: '30px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Título da Tarefa</label>
              <input required style={adminInputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Status Inicial</label>
              <select style={adminInputStyle} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as KanbanStatus})}>
                <option value="A Fazer">A Fazer</option>
                <option value="Em Progresso">Em Progresso</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Prioridade</label>
              <select style={adminInputStyle} value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Data de Entrega</label>
              <input type="date" style={adminInputStyle} value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Descrição/Detalhes</label>
            <textarea style={adminInputStyle} rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> {editingId ? 'Atualizar Tarefa' : 'Salvar Tarefa'}
            </button>
          </div>
        </form>
      )}

      <div style={{ marginTop: '20px' }}>
        <KanbanBoard 
          tasks={tasks} 
          onEditTask={handleEdit} 
          onDeleteTask={handleDelete}
          onTasksChange={handleTasksChange}
          isDraggable={true}
        />
        {tasks.length === 0 && !loading && <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>Nenhuma tarefa planejada.</p>}
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }
const adminInputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border)',
  color: 'white',
  outline: 'none'
}
