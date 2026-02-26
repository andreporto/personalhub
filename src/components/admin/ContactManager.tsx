'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Trash2, Mail, Calendar, User } from 'lucide-react'

export default function ContactManager() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    if (data) setMessages(data)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (confirm('Excluir esta mensagem permanentemente?')) {
      await supabase.from('contacts').delete().eq('id', id)
      fetchMessages()
    }
  }

  async function toggleRead(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('contacts')
      .update({ is_read: !currentStatus })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar status:', error.message, error.code)
      alert('Erro ao atualizar banco: ' + error.message)
    } else {
      fetchMessages()
    }
  }

  return (
    <div>
      <h2 style={{ background: 'none', color: 'white', marginBottom: '30px' }}>Mensagens de Contato</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map(msg => (
          <div key={msg.id} className="glass" style={{ padding: '25px', opacity: msg.is_read ? 0.7 : 1, borderLeft: msg.is_read ? '1px solid var(--border)' : '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  <User size={16} style={{ color: msg.is_read ? 'var(--text-dim)' : 'var(--primary)' }} />
                  <strong style={{ fontSize: '1.1rem' }}>{msg.name}</strong>
                  {!msg.is_read && <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '10px' }}>NOVA</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  <Mail size={14} /> {msg.email}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                  <Calendar size={14} /> {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                </div>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => toggleRead(msg.id, msg.is_read)} 
                    style={{ background: 'none', color: 'var(--text-dim)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', border: 'none' }}
                  >
                    Marcar como {msg.is_read ? 'não lida' : 'lida'}
                  </button>
                  <button onClick={() => handleDelete(msg.id)} style={{ background: 'none', color: '#ff4b4b', padding: 0 }}><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--primary)' }}>Assunto: {msg.subject}</strong>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{msg.message}</p>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>Nenhuma mensagem recebida ainda.</p>}
      </div>
    </div>
  )
}
