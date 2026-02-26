import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CommandCenter from '@/components/CommandCenter'
import { describe, it, expect, vi } from 'vitest'

describe('CommandCenter Component', () => {
  it('opens when CMD+K is pressed', async () => {
    render(<CommandCenter />)
    
    // Inicialmente deve mostrar apenas o botão flutuante
    expect(screen.getByText(/Pressione/i)).toBeInTheDocument()
    
    // Simula CMD+K
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    
    expect(screen.getByPlaceholderText(/O que você está procurando/i)).toBeInTheDocument()
  })

  it('closes when Escape is pressed', async () => {
    render(<CommandCenter />)
    
    // Abre primeiro
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(screen.getByPlaceholderText(/O que você está procurando/i)).toBeInTheDocument()
    
    // Fecha com ESC
    fireEvent.keyDown(window, { key: 'Escape' })
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/O que você está procurando/i)).not.toBeInTheDocument()
    })
  })
})
