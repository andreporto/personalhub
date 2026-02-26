'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Project, KnowledgeItem, KanbanTask } from '@/types'
import { Search, Folder, Book, CheckSquare, X, Command } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CommandCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    projects: Project[]
    knowledge: KnowledgeItem[]
    tasks: KanbanTask[]
  }>({ projects: [], knowledge: [], tasks: [] })
  
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    if (!query) {
      setResults({ projects: [], knowledge: [], tasks: [] })
      return
    }

    const search = async () => {
      // Parallel searching in Supabase
      const [projRes, knowRes, taskRes] = await Promise.all([
        supabase.from('projects').select('*').ilike('title', `%${query}%`).limit(3),
        supabase.from('knowledge_base').select('*').ilike('title', `%${query}%`).limit(3),
        supabase.from('kanban_tasks').select('*').ilike('title', `%${query}%`).limit(3)
      ])

      setResults({
        projects: (projRes.data as Project[]) || [],
        knowledge: (knowRes.data as KnowledgeItem[]) || [],
        tasks: (taskRes.data as KanbanTask[]) || []
      })
    }

    const timer = setTimeout(search, 300)
    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return (
    <div 
      onClick={() => setIsOpen(true)}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        padding: '10px 15px',
        borderRadius: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backdropFilter: 'blur(10px)',
        zIndex: 90
      }}
    >
      <Command size={16} />
      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Pressione <kbd style={{ background: '#333', padding: '2px 5px', borderRadius: '4px' }}>⌘ K</kbd> para buscar</span>
    </div>
  )

  const hasResults = results.projects.length > 0 || results.knowledge.length > 0 || results.tasks.length > 0

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '15vh',
      zIndex: 1000
    }}>
      <div 
        className="glass" 
        style={{
          width: '90%',
          maxWidth: '600px',
          height: 'fit-content',
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Search size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="O que você está procurando?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              outline: 'none'
            }}
          />
          <X 
            size={20} 
            style={{ cursor: 'pointer', color: 'var(--text-dim)' }} 
            onClick={() => setIsOpen(false)} 
          />
        </div>

        <div style={{ overflowY: 'auto', padding: '10px' }}>
          {!query && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)' }}>
              Busque por projetos, notas ou tarefas...
            </div>
          )}

          {query && !hasResults && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)' }}>
              Nenhum resultado encontrado para "{query}"
            </div>
          )}

          {results.projects.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ padding: '10px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', opacity: 0.8 }}>Projetos</h4>
              {results.projects.map(p => (
                <div 
                  key={p.id} 
                  className="search-item"
                  onClick={() => { setIsOpen(false); router.push('#portfolio') }}
                >
                  <Folder size={16} /> <span>{p.title}</span>
                </div>
              ))}
            </div>
          )}

          {results.knowledge.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ padding: '10px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.8 }}>Conhecimento</h4>
              {results.knowledge.map(k => (
                <div 
                  key={k.id} 
                  className="search-item"
                  onClick={() => { setIsOpen(false); window.open(k.url, '_blank') }}
                >
                  <Book size={16} /> <span>{k.title}</span>
                </div>
              ))}
            </div>
          )}

          {results.tasks.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ padding: '10px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary)', opacity: 0.8 }}>Tarefas</h4>
              {results.tasks.map(t => (
                <div 
                  key={t.id} 
                  className="search-item"
                  onClick={() => { setIsOpen(false); router.push('#kanban') }}
                >
                  <CheckSquare size={16} /> <span>{t.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-item {
          padding: 12px 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .search-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .search-item span {
          color: var(--text-light);
        }
      `}</style>
    </div>
  )
}
