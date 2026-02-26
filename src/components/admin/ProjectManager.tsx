'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Project } from '@/types'
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react'

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Estados do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    tech_stack: '',
    github_url: '',
    live_url: ''
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (data) setProjects(data)
    setLoading(false)
  }

  const [uploading, setUploading] = useState(false)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `project-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
    } catch (error: any) {
      alert('Erro no upload: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const payload = {
      ...formData,
      tech_stack: formData.tech_stack.split(',').map(s => s.trim())
    }

    let result;
    if (editingId) {
      result = await supabase.from('projects').update(payload).eq('id', editingId)
    } else {
      result = await supabase.from('projects').insert([payload])
      
      // Log activity
      if (!result.error) {
        await supabase.from('activity_log').insert({
          type: 'project',
          action: 'create',
          description: `Novo projeto adicionado: ${payload.title}`
        })
      }
    }

    if (result.error) {
      alert('Erro ao salvar projeto: ' + result.error.message)
    } else {
      resetForm()
      fetchProjects()
    }
    setLoading(false)
  }

  function handleEdit(project: Project) {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url || '',
      tech_stack: project.tech_stack.join(', '),
      github_url: project.github_url || '',
      live_url: project.live_url || ''
    })
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      await supabase.from('projects').delete().eq('id', id)
      fetchProjects()
    }
  }

  function resetForm() {
    setFormData({ title: '', description: '', image_url: '', tech_stack: '', github_url: '', live_url: '' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ background: 'none', color: 'white' }}>Gestão de Projetos</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showForm ? <><X size={18} /> Cancelar</> : <><Plus size={18} /> Novo Projeto</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: '30px', marginBottom: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Título</label>
            <input required style={adminInputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Descrição</label>
            <textarea required style={adminInputStyle} rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Imagem do Projeto</label>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                disabled={uploading}
                style={{ fontSize: '0.8rem' }}
              />
              {uploading && <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Enviando...</span>}
              {formData.image_url && (
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} 
                />
              )}
            </div>
            <input 
              placeholder="Ou cole a URL da imagem diretamente"
              style={{ ...adminInputStyle, marginTop: '10px' }} 
              value={formData.image_url} 
              onChange={e => setFormData({...formData, image_url: e.target.value})} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Tech Stack (separado por vírgula)</label>
            <input placeholder="React, Next.js, Node" style={adminInputStyle} value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>GitHub URL</label>
            <input style={adminInputStyle} value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Live URL</label>
            <input style={adminInputStyle} value={formData.live_url} onChange={e => setFormData({...formData, live_url: e.target.value})} />
          </div>
          <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
            <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> {editingId ? 'Salvar Alterações' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      )}

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={tableCell}>Título</th>
              <th style={tableCell}>Techs</th>
              <th style={tableCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={tableCell}>{p.title}</td>
                <td style={tableCell}>{p.tech_stack.join(', ')}</td>
                <td style={tableCell}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEdit(p)} style={{ background: 'none', color: 'var(--primary)', padding: 0 }}><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'none', color: '#ff4b4b', padding: 0 }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

const tableCell = {
  padding: '15px 20px',
  fontSize: '0.95rem'
}
