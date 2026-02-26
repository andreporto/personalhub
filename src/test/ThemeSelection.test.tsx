import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SettingsManager from '@/components/admin/SettingsManager'
import { describe, it, expect, vi } from 'vitest'

describe('SettingsManager Component', () => {
  it('changes theme when a palette is clicked', async () => {
    render(<SettingsManager />)
    
    const brazilTheme = screen.getByText('Brasil')
    fireEvent.click(brazilTheme)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('brazil')
  })

  it('renders theme options', () => {
    render(<SettingsManager />)
    expect(screen.getByText('Padrão (Cyber)')).toBeInTheDocument()
    expect(screen.getByText('Luxury Gold')).toBeInTheDocument()
    expect(screen.getByText('Québec (Canadá)')).toBeInTheDocument()
  })
})
