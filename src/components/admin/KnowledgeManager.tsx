'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { KnowledgeItem } from '@/types'
import { Plus, Trash2, Edit2, X, Save, Link as LinkIcon, Database } from 'lucide-react'

export default function KnowledgeManager() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: '',
    notes: '',
    related_projects: [] as string[]
  })

  useEffect(() => {
    fetchItems()
    fetchProjects()
  }, [])

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('id, title')
    if (data) setProjects(data)
  }

  async function fetchItems() {
    setLoading(true)
    // Fetch items with their related project IDs from the join table
    const { data: baseItems } = await supabase.from('knowledge_base').select('*').order('created_at', { ascending: false })
    
    if (baseItems) {
      const { data: relations } = await supabase.from('project_knowledge').select('*')
      
      const itemsWithRelations = baseItems.map(item => ({
        ...item,
        related_projects: relations?.filter(r => r.knowledge_id === item.id).map(r => r.project_id) || []
      }))
      
      setItems(itemsWithRelations as KnowledgeItem[])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const { related_projects, ...baseData } = formData
    
    let result;
    if (editingId) {
      result = await supabase.from('knowledge_base').update(baseData).eq('id', editingId).select()
    } else {
      result = await supabase.from('knowledge_base').insert([baseData]).select()
    }

    if (result.error) {
      alert('Erro ao salvar referência: ' + result.error.message)
    } else {
      const knowledgeId = result.data[0].id
      
      // Update relations
      if (editingId) {
        await supabase.from('project_knowledge').delete().eq('knowledge_id', editingId)
      }
      
      if (related_projects.length > 0) {
        const relations = related_projects.map(projectId => ({
          project_id: projectId,
          knowledge_id: knowledgeId
        }))
        await supabase.from('project_knowledge').insert(relations)
      }

      // Log activity if new
      if (!editingId) {
        await supabase.from('activity_log').insert({
          type: 'knowledge',
          action: 'study',
          description: `Nova referência estudada: ${formData.title}`
        })
      }

      resetForm()
      fetchItems()
    }
    setLoading(false)
  }

  function handleEdit(item: KnowledgeItem) {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      url: item.url,
      category: item.category,
      notes: item.notes || '',
      related_projects: item.related_projects || []
    })
    setShowForm(true)
  }

  function toggleProject(projectId: string) {
    setFormData(prev => ({
      ...prev,
      related_projects: prev.related_projects.includes(projectId)
        ? prev.related_projects.filter(id => id !== projectId)
        : [...prev.related_projects, projectId]
    }))
  }

  async function handleDelete(id: string) {
    if (confirm('Excluir esta referência?')) {
      await supabase.from('knowledge_base').delete().eq('id', id)
      fetchItems()
    }
  }

  function resetForm() {
    setFormData({ title: '', url: '', category: '', notes: '', related_projects: [] })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Base de Conhecimento</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showForm ? <><X size={18} /> Cancelar</> : <><Plus size={18} /> Nova Referência</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: '30px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Título</label>
              <input required style={adminInputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Categoria</label>
              <input required style={adminInputStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>URL</label>
            <input required type="url" style={adminInputStyle} value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Vincular a Projetos</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {projects.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => toggleProject(p.id)}
                  style={{ 
                    padding: '5px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    cursor: 'pointer',
                    background: formData.related_projects.includes(p.id) ? 'rgba(0, 198, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: formData.related_projects.includes(p.id) ? '1px solid var(--primary)' : '1px solid transparent',
                    color: formData.related_projects.includes(p.id) ? 'var(--primary)' : 'var(--text-dim)',
                    transition: 'all 0.2s'
                  }}
                >
                  {p.title}
                </div>
              ))}
              {projects.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Nenhum projeto encontrado para vincular.</p>}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Notas/Resumo</label>
            <textarea style={adminInputStyle} rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> {editingId ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      )}

      <div className="glass">
        {items.map(item => (
          <div key={item.id} style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{item.title}</h4>
              <p style={{ margin: '5px 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>{item.category} • {item.url}</p>
              {item.related_projects && item.related_projects.length > 0 && (
                <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
                  <Database size={12} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>
                    Vinculado a: {projects.filter(p => item.related_projects?.includes(p.id)).map(p => p.title).join(', ')}
                  </span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => handleEdit(item)} style={{ background: 'none', color: 'var(--primary)', padding: 0 }}><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(item.id)} style={{ background: 'none', color: '#ff4b4b', padding: 0 }}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const adminInputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border)',
  color: 'white',
  outline: 'none'
}
