/**
 * Galeria de Projetos: Renderiza a listagem de projetos com filtragem.
 * Integra-se com o Grafo de Conhecimento para exibir estudos relacionados.
 */
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Project, KnowledgeItem } from '@/types'
import ProjectCard from './ProjectCard'

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([])
  const [relations, setRelations] = useState<any[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Todos')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [projRes, knowRes, relRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('knowledge_base').select('*'),
        supabase.from('project_knowledge').select('*')
      ])

      if (projRes.data && projRes.data.length > 0) {
        setProjects(projRes.data)
        setFilteredProjects(projRes.data)
        setKnowledge(knowRes.data || [])
        setRelations(relRes.data || [])
      } else {
        // Fallback or empty
        setProjects([])
        setFilteredProjects([])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const allTechs = ['Todos', ...Array.from(new Set(projects.flatMap(p => p.tech_stack)))]

  const handleFilter = (tech: string) => {
    setActiveFilter(tech)
    if (tech === 'Todos') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.tech_stack.includes(tech)))
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando projetos...</div>

  return (
    <div>
      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
        {allTechs.map(tech => (
          <button
            key={tech}
            onClick={() => handleFilter(tech)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: activeFilter === tech ? '1px solid var(--primary)' : '1px solid var(--border)',
              background: activeFilter === tech ? 'rgba(0, 198, 255, 0.1)' : 'transparent',
              color: activeFilter === tech ? 'var(--primary)' : 'var(--text-dim)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        {filteredProjects.map(project => {
          const relatedKnowledgeIds = relations
            .filter(r => r.project_id === project.id)
            .map(r => r.knowledge_id)
          
          const relatedKnowledge = knowledge.filter(k => relatedKnowledgeIds.includes(k.id))

          return (
            <ProjectCard 
              key={project.id} 
              project={project} 
              relatedKnowledge={relatedKnowledge}
            />
          )
        })}
      </div>
      
      {filteredProjects.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '40px' }}>
          Nenhum projeto encontrado para este filtro.
        </p>
      )}
    </div>
  )
}
