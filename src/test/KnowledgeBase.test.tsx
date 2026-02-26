import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import KnowledgeBase from '@/components/KnowledgeBase'
import { describe, it, expect, vi } from 'vitest'
import { supabase } from '@/lib/supabase'

describe('KnowledgeBase Component', () => {
  it('renders correctly and shows mock data when empty', async () => {
    render(<KnowledgeBase />)
    expect(screen.getByPlaceholderText(/Buscar por título/i)).toBeInTheDocument()
    
    // Deve mostrar os dados mockados inicialmente se o fetch retornar vazio
    await waitFor(() => {
      expect(screen.getByText('Documentação Oficial Next.js')).toBeInTheDocument()
    })
  })

  it('filters items based on search input', async () => {
    render(<KnowledgeBase />)
    const input = screen.getByPlaceholderText(/Buscar por título/i)
    
    // Aguarda o carregamento inicial sumir
    await waitFor(() => {
      expect(screen.queryByText(/Carregando referências/i)).not.toBeInTheDocument()
    })

    fireEvent.change(input, { target: { value: 'SQL' } })
    
    expect(screen.getByText('Guia de SQL para Supabase')).toBeInTheDocument()
    expect(screen.queryByText('Clean Code JavaScript')).not.toBeInTheDocument()
  })

  it('filters items by category tag', async () => {
    render(<KnowledgeBase />)
    
    // Aguarda o carregamento inicial sumir
    await waitFor(() => {
      expect(screen.queryByText(/Carregando referências/i)).not.toBeInTheDocument()
    })

    // Busca especificamente pelo botão de filtro, não pela tag do card
    const buttons = screen.getAllByRole('button')
    const dbFilter = buttons.find(b => b.textContent === 'Database')
    
    if (dbFilter) {
      fireEvent.click(dbFilter)
    }
    
    expect(screen.getByText('Guia de SQL para Supabase')).toBeInTheDocument()
    expect(screen.queryByText('Documentação Oficial Next.js')).not.toBeInTheDocument()
  })
})
