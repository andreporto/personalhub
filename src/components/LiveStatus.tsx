'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { KanbanTask, KnowledgeItem } from '@/types'
import { Activity, Zap, Book } from 'lucide-react'

export default function LiveStatus() {
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)
  const [latestKnowledge, setLatestKnowledge] = useState<KnowledgeItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLiveStatus() {
      setLoading(true)
      const [taskRes, knowRes] = await Promise.all([
        supabase
          .from('kanban_tasks')
          .select('*')
          .eq('status', 'Em Progresso')
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('knowledge_base')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
      ])

      if (taskRes.data?.[0]) setActiveTask(taskRes.data[0])
      if (knowRes.data?.[0]) setLatestKnowledge(knowRes.data[0])
      setLoading(false)
    }

    fetchLiveStatus()
  }, [])

  if (loading) return null

  return (
    <div className="container" style={{ marginBottom: '40px' }}>
      <div className="glass" style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '30px', 
        padding: '20px 30px',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeft: '4px solid var(--primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={20} className="pulse" style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Status Agora:</span>
        </div>

        {activeTask && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.95rem' }}>
              Trabalhando em: <strong style={{ color: 'white' }}>{activeTask.title}</strong>
            </span>
          </div>
        )}

        {latestKnowledge && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Book size={18} style={{ color: 'var(--secondary)' }} />
            <span style={{ fontSize: '0.95rem' }}>
              Recém aprendido: <strong style={{ color: 'white' }}>{latestKnowledge.title}</strong>
            </span>
          </div>
        )}

        {!activeTask && !latestKnowledge && (
          <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Nenhuma atividade recente registrada.</span>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .pulse {
          animation: pulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
