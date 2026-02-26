'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    // Validação básica
    if (!data.email || !data.message) {
      setErrorMessage('Por favor, preencha os campos obrigatórios.')
      setStatus('error')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('contacts').insert([data])

    if (!error) {
      setStatus('success')
      // Resetar formulário após 5 segundos ou ao clicar em nova mensagem
    } else {
      console.error('Erro Supabase:', error)
      setErrorMessage('Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.')
      setStatus('error')
    }
    setLoading(false)
  }

  if (status === 'success') {
    return (
      <div className="glass animate" style={{ padding: '60px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <CheckCircle size={60} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
        <h2 style={{ color: 'white', marginBottom: '15px', background: 'none' }}>Mensagem Enviada!</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>
          Obrigado pelo contato. Responderei o mais breve possível.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="btn"
        >
          Enviar outra mensagem
        </button>
      </div>
    )
  }

  return (
    <div className="glass" style={{ maxWidth: '700px', margin: '0 auto', overflow: 'hidden' }}>
      <div style={{ padding: '40px', borderBottom: '1px solid var(--border)', background: 'rgba(0, 198, 255, 0.02)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Vamos conversar?</h2>
        <p style={{ color: 'var(--text-dim)' }}>Preencha o formulário abaixo para enviar uma proposta ou tirar dúvidas.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Nome</label>
            <input 
              id="name"
              name="name" 
              placeholder="Seu nome completo" 
              required 
              style={inputStyle} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>E-mail</label>
            <input 
              id="email"
              name="email" 
              type="email" 
              placeholder="seu@email.com" 
              required 
              style={inputStyle} 
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="subject" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Assunto</label>
          <input 
            id="subject"
            name="subject" 
            placeholder="Qual o motivo do contato?" 
            required 
            style={inputStyle} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Mensagem</label>
          <textarea 
            id="message"
            name="message" 
            placeholder="Escreva sua mensagem aqui..." 
            rows={5} 
            required 
            style={{ ...inputStyle, resize: 'none' }} 
          />
        </div>

        {status === 'error' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4b4b', fontSize: '0.9rem', padding: '10px', background: 'rgba(255, 75, 75, 0.1)', borderRadius: '8px' }}>
            <AlertCircle size={18} />
            {errorMessage}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            padding: '15px',
            fontSize: '1rem'
          }}
        >
          {loading ? (
            'Enviando...'
          ) : (
            <>
              Enviar Mensagem <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border)',
  color: 'white',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontSize: '0.95rem'
}
