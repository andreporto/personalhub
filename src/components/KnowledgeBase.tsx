/**
 * Base de Conhecimento (Digital Garden): Listagem de notas e estudos.
 * Oferece busca global por texto e filtros dinâmicos por categoria.
 */
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { KnowledgeItem } from '@/types'
import { Search, ExternalLink, BookMarked } from 'lucide-react'

const MOCK_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: '1',
    title: 'Documentação Oficial Next.js',
    url: 'https://nextjs.org/docs',
    category: 'Framework',
    notes: 'Referência principal para App Router e Server Components.',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Guia de SQL para Supabase',
    url: 'https://supabase.com/docs/guides/database',
    category: 'Database',
    notes: 'Comandos úteis para gerenciar PostgreSQL e RLS.',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Clean Code JavaScript',
    url: 'https://github.com/ryanmcdermott/clean-code-javascript',
    category: 'Best Practices',
    notes: 'Princípios de engenharia de software aplicados ao JavaScript.',
    created_at: new Date().toISOString()
  }
]

export default function KnowledgeBase() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchKnowledge() {
      setLoading(true)
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setItems(MOCK_KNOWLEDGE)
      } else {
        setItems(data as KnowledgeItem[])
      }
      setLoading(false)
    }

    fetchKnowledge()
  }, [])

  const [selectedCategory, setSelectedCategory] = useState('Todas')

  const categories = ['Todas', ...Array.from(new Set(items.map(i => i.category)))]

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="glass" style={{ padding: '40px' }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search 
          size={20} 
          style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} 
        />
        <input 
          type="text" 
          placeholder="Buscar por título, categoria ou anotações..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '15px 15px 15px 50px', 
            borderRadius: '8px', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--border)', 
            color: 'white',
            fontSize: '1rem'
          }} 
        />
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '5px 12px',
              borderRadius: '15px',
              fontSize: '0.8rem',
              border: selectedCategory === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: selectedCategory === cat ? 'rgba(255, 0, 200, 0.1)' : 'transparent',
              color: selectedCategory === cat ? 'var(--accent)' : 'var(--text-dim)',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>Carregando referências...</p>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div 
              key={item.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                padding: '20px', 
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.2s',
                borderRadius: '8px'
              }}
              className="item-hover"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookMarked size={18} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'white', background: 'none' }}>{item.title}</h3>
                </div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}
                >
                  Link <ExternalLink size={14} />
                </a>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: 'var(--secondary)', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  color: 'white'
                }}>
                  {item.category}
                </span>
              </div>

              {item.notes && (
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: 0 }}>
                  {item.notes}
                </p>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>
            Nenhuma referência encontrada para "{searchTerm}".
          </p>
        )}
      </div>

      <style jsx>{`
        .item-hover:hover {
          background: rgba(255, 255, 255, 0.03);
        }
      `}</style>
    </div>
  )
}
