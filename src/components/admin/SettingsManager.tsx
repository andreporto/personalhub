/**
 * Dashboard Admin - Configurações: Central de personalização do Hub.
 * Gerencia a troca global de temas (Supabase) e alteração de credenciais.
 */
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Key, Save, AlertCircle, CheckCircle, Palette, Download, Database } from 'lucide-react'
import { useRouter } from 'next/navigation'

const THEMES = [
  { id: 'default', name: 'Padrão (Cyber)', colors: ['#00c6ff', '#0072ff', '#ff00c8'] },
  { id: 'ocean', name: 'Oceano', colors: ['#00d2ff', '#3a7bd5', '#00ffcc'] },
  { id: 'sunset', name: 'Pôr do Sol', colors: ['#ff512f', '#dd2476', '#ffac33'] },
  { id: 'vibrant', name: 'Vibrante', colors: ['#8e2de2', '#4a00e0', '#f000ff'] },
  { id: 'purple', name: 'Púrpura', colors: ['#da22ff', '#9733ee', '#00d2ff'] },
  { id: 'brazil', name: 'Brasil', colors: ['#009c3b', '#ffdf00', '#002776'] },
  { id: 'quebec', name: 'Québec (Canadá)', colors: ['#003399', '#ffffff', '#003399'] },
  { id: 'matrix', name: 'Matrix', colors: ['#00ff41', '#008f11', '#003b00'] },
  { id: 'midnight', name: 'Midnight Blue', colors: ['#3498db', '#2c3e50', '#00c6ff'] },
  { id: 'emerald', name: 'Emerald City', colors: ['#2ecc71', '#27ae60', '#00ff88'] },
  { id: 'nord', name: 'Nordic Frost', colors: ['#88c0d0', '#81a1c1', '#b48ead'] },
  { id: 'crimson', name: 'Crimson Red', colors: ['#ff416c', '#ff4b2b', '#ff5f6d'] },
  { id: 'gold', name: 'Luxury Gold', colors: ['#f1c40f', '#d4af37', '#ffefba'] },
]

export default function SettingsManager() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [currentTheme, setCurrentTheme] = useState('default')
  const router = useRouter()

  useEffect(() => {
    async function fetchTheme() {
      const { data } = await supabase
        .from('site_settings')
        .select('theme_id')
        .eq('id', 'global_config')
        .single()
      if (data) {
        setCurrentTheme(data.theme_id)
        document.documentElement.setAttribute('data-theme', data.theme_id)
      }
    }
    fetchTheme()
  }, [])

  const changeTheme = async (themeId: string) => {
    // 1. Update UI immediately
    setCurrentTheme(themeId)
    document.documentElement.setAttribute('data-theme', themeId)
    
    // 2. Persist to DB
    const { error } = await supabase
      .from('site_settings')
      .update({ theme_id: themeId })
      .eq('id', 'global_config')

    if (error) {
      console.error('Database Error:', error)
      alert('Erro ao salvar tema no banco: ' + error.message)
    }
    
    // 3. Refresh to sync server components
    router.refresh()
  }

  const [backupLoading, setBackupLoading] = useState(false)

  const handleExportBackup = async () => {
    try {
      setBackupLoading(true)
      const tables = [
        'projects', 
        'knowledge_base', 
        'kanban_tasks', 
        'contacts', 
        'activity_log', 
        'site_settings', 
        'project_knowledge'
      ]

      const backupData: any = {}

      const fetchPromises = tables.map(async (table) => {
        const { data, error } = await supabase.from(table).select('*')
        if (error) throw error
        backupData[table] = data
      })

      await Promise.all(fetchPromises)

      // Create and download file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const date = new Date().toISOString().split('T')[0]
      
      link.href = url
      link.download = `personal-hub-backup-${date}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      alert('Backup gerado e baixado com sucesso!')
    } catch (error: any) {
      console.error('Backup Error:', error)
      alert('Erro ao gerar backup: ' + error.message)
    } finally {
      setBackupLoading(false)
    }
  }

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
      <h2 style={{ marginBottom: '30px' }}>Configurações do Hub</h2>

      {/* Seletor de Cores */}
      <div className="glass" style={{ padding: '30px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Palette size={20} className="text-primary" /> Paleta de Cores
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          {THEMES.map(theme => (
            <div 
              key={theme.id}
              onClick={() => changeTheme(theme.id)}
              style={{ 
                padding: '15px', 
                borderRadius: '8px', 
                background: currentTheme === theme.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                border: currentTheme === theme.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '5px', 
                marginBottom: '10px' 
              }}>
                {theme.colors.map((c, i) => (
                  <div key={i} style={{ width: '15px', height: '15px', borderRadius: '50%', background: c }} />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: currentTheme === theme.id ? 'white' : 'var(--text-dim)' }}>
                {theme.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Backup do Banco de Dados */}
      <div className="glass" style={{ padding: '30px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database size={20} className="text-primary" /> Backup de Dados
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
          Exporte todos os seus projetos, notas, tarefas e mensagens em um único arquivo JSON para segurança local.
        </p>
        
        <button 
          onClick={handleExportBackup} 
          disabled={backupLoading}
          className="btn"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {backupLoading ? 'Gerando Backup...' : <><Download size={18} /> Baixar Backup Completo (.json)</>}
        </button>
      </div>

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
