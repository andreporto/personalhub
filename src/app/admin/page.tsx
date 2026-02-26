'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, FolderKanban, BookOpen, Settings, LogOut, MessageSquare } from 'lucide-react'
import ProjectManager from '@/components/admin/ProjectManager'
import KnowledgeManager from '@/components/admin/KnowledgeManager'
import ContactManager from '@/components/admin/ContactManager'
import KanbanManager from '@/components/admin/KanbanManager'
import SettingsManager from '@/components/admin/SettingsManager'

type AdminTab = 'overview' | 'projects' | 'knowledge' | 'messages' | 'kanban' | 'settings'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [stats, setStats] = useState({ projects: 0, knowledge: 0, messages: 0, kanban: 0 })
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchStats()
      }
    }
    checkUser()
  }, [router])

  async function fetchStats() {
    const [p, k, m, kan] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('knowledge_base').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('kanban_tasks').select('*', { count: 'exact', head: true })
    ])
    setStats({
      projects: p.count || 0,
      knowledge: k.count || 0,
      messages: m.count || 0,
      kanban: kan.count || 0
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Verificando sessão...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '280px', padding: '30px', display: 'flex', flexDirection: 'column', borderRadius: 0, borderLeft: 'none', borderTop: 'none', borderBottom: 'none', position: 'fixed', height: '100vh' }}>
        <div style={{ marginBottom: '40px', padding: '0 10px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Admin Panel</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
          <AdminNavLink 
            icon={<LayoutDashboard size={20} />} 
            label="Visão Geral" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          />
          <AdminNavLink 
            icon={<FolderKanban size={20} />} 
            label="Meus Projetos" 
            active={activeTab === 'projects'} 
            onClick={() => setActiveTab('projects')}
          />
          <AdminNavLink 
            icon={<BookOpen size={20} />} 
            label="Conhecimento" 
            active={activeTab === 'knowledge'} 
            onClick={() => setActiveTab('knowledge')}
          />
          <AdminNavLink 
            icon={<LayoutDashboard size={20} />} 
            label="Planejador Kanban" 
            active={activeTab === 'kanban'} 
            onClick={() => setActiveTab('kanban')}
          />
          <AdminNavLink 
            icon={<MessageSquare size={20} />} 
            label="Mensagens" 
            active={activeTab === 'messages'} 
            onClick={() => setActiveTab('messages')}
          />
          <AdminNavLink 
            icon={<Settings size={20} />} 
            label="Configurações" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          />
        </nav>

        <button 
          onClick={handleLogout}
          style={{ 
            background: 'transparent', 
            border: '1px solid rgba(255, 75, 75, 0.3)', 
            color: '#ff4b4b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '20px'
          }}
        >
          Sair <LogOut size={18} />
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '100px 50px 50px 50px', marginLeft: '280px' }}>
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ marginBottom: '30px' }}>Bem-vindo de volta!</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <StatCard label="Projetos" value={stats.projects.toString()} />
              <StatCard label="Referências" value={stats.knowledge.toString()} />
              <StatCard label="Tarefas" value={stats.kanban.toString()} />
              <StatCard label="Mensagens" value={stats.messages.toString()} />
            </div>
            <div className="glass" style={{ marginTop: '40px', padding: '30px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-dim)' }}>
                Selecione uma categoria na barra lateral para começar a gerenciar seu conteúdo.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'projects' && <ProjectManager />}
        {activeTab === 'knowledge' && <KnowledgeManager />}
        {activeTab === 'kanban' && <KanbanManager />}
        {activeTab === 'messages' && <ContactManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  )
}

function AdminNavLink({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px 15px', 
        borderRadius: '8px',
        background: active ? 'rgba(0, 198, 255, 0.1)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-dim)',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      {icon}
      <span style={{ fontWeight: active ? 'bold' : 'normal' }}>{label}</span>
    </div>
  )
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '5px' }}>{label}</p>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{value}</p>
    </div>
  )
}
