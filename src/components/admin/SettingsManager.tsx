'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Key, Save, AlertCircle, CheckCircle } from 'lucide-react'

export default function SettingsManager() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' })
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar senha: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' })
      setPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ background: 'none', color: 'white', marginBottom: '30px' }}>Configurações de Perfil</h2>

      <div className="glass" style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Key size={20} className="text-primary" /> Alterar Senha
        </h3>

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Nova Senha</label>
            <input 
              type="password" 
              required 
              style={adminInputStyle} 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label style={labelStyle}>Confirmar Nova Senha</label>
            <input 
              type="password" 
              required 
              style={adminInputStyle} 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          {message && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '6px', 
              background: message.type === 'success' ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 75, 75, 0.1)',
              color: message.type === 'success' ? '#00ff9d' : '#ff4b4b',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          <div style={{ textAlign: 'right' }}>
            <button 
              type="submit" 
              className="btn" 
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={18} /> {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }
const adminInputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '6px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border)',
  color: 'white',
  outline: 'none',
  fontSize: '1rem'
}
