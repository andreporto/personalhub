import '../styles/globals.css'
import type { Metadata } from 'next'
import AuthStatus from '@/components/AuthStatus'
import CommandCenter from '@/components/CommandCenter'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Meu Portfolio & Hub Pessoal',
  description: 'Projetos, Conhecimento e Planejamento',
}

async function getGlobalTheme() {
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('theme_id')
      .eq('id', 'global_config')
      .single()
    return data?.theme_id || 'default'
  } catch (e) {
    return 'default'
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = await getGlobalTheme()

  return (
    <html lang="pt-br" data-theme={theme}>
      <body>
        <nav className="glass" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1000px', zIndex: 100, padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Personal Hub</div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="/#portfolio" style={{ textDecoration: 'none', color: 'inherit' }}>Projetos</a>
            <a href="/#knowledge" style={{ textDecoration: 'none', color: 'inherit' }}>Conhecimento</a>
            <a href="/#kanban" style={{ textDecoration: 'none', color: 'inherit' }}>Planejamento</a>
            <a href="/#contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contato</a>
            <div style={{ marginLeft: '10px', paddingLeft: '20px', borderLeft: '1px solid var(--border)' }}>
              <AuthStatus />
            </div>
          </div>
        </nav>
        {children}
        <CommandCenter />
      </body>
    </html>
  )
}
