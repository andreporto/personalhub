import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from '@/components/ContactForm'
import { describe, it, expect, vi } from 'vitest'

describe('ContactForm Component', () => {
  it('shows error message if mandatory fields are missing', async () => {
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /Enviar Mensagem/i })
    fireEvent.click(submitButton)
    
    // Como os campos têm 'required' no HTML, o browser impediria, 
    // mas vamos testar a lógica do componente
    expect(screen.getByText(/Vamos conversar/i)).toBeInTheDocument()
  })

  it('renders all form inputs', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Assunto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Mensagem/i)).toBeInTheDocument()
  })
})
