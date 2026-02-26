import ContactForm from '@/components/ContactForm'
import ProjectList from '@/components/ProjectList'
import KnowledgeBase from '@/components/KnowledgeBase'
import KanbanBoard from '@/components/KanbanBoard'
import LiveStatus from '@/components/LiveStatus'

export default function Home() {
  return (
    <main style={{ paddingTop: '100px' }}>
      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Dev Portfolio & Personal Hub</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
          Gerencie seus projetos, centralize seu conhecimento e planeje sua evolução técnica em um só lugar.
        </p>
      </section>

      {/* Live Status Section */}
      <LiveStatus />

      {/* Portfolio Section */}
      <section id="portfolio" className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Projetos em Destaque</h2>
        <ProjectList />
      </section>

      {/* Knowledge Base Section */}
      <section id="knowledge" className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Base de Conhecimento</h2>
        <KnowledgeBase />
      </section>

      {/* Kanban Section */}
      <section id="kanban" className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Planejamento & Metas</h2>
        <KanbanBoard isDraggable={false} />
      </section>

      {/* Contact Section */}
      <section id="contact" className="container" style={{ padding: '80px 0' }}>
        <ContactForm />
      </section>

      <footer style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)', borderTop: '1px solid var(--border)' }}>
        © 2026 Personal Hub Portfolio. Todos os direitos reservados.
      </footer>
    </main>
  )
}
