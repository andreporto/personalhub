/**
 * Componente que exibe o status de autenticação do usuário (logado ou não)
 * e fornece o link de login ou o e-mail do usuário autenticado.
 */
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, LogIn, Settings } from 'lucide-react'
import Link from 'next/link'

export default function AuthStatus() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (user) {
    return (
      <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', padding: '5px 12px', border: '1px solid var(--primary)', borderRadius: '20px' }}>
        <Settings size={16} /> Painel Admin
      </Link>
    )
  }

  return (
    <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.9rem' }}>
      <LogIn size={16} /> Login
    </Link>
  )
}
