import { Project, KnowledgeItem } from '@/types'
import { Github, ExternalLink, Book } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  relatedKnowledge?: KnowledgeItem[]
}

export default function ProjectCard({ project, relatedKnowledge = [] }: ProjectCardProps) {
  return (
    <div className="glass animate" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div 
        style={{ 
          width: '100%', 
          height: '180px', 
          backgroundImage: `url(${project.image_url || 'https://via.placeholder.com/400x200'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px', 
          marginBottom: '15px' 
        }} 
      />
      <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{project.title}</h3>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '15px', flexGrow: 1 }}>
        {project.description}
      </p>

      {/* Related Knowledge (Digital Garden Link) */}
      {relatedKnowledge.length > 0 && (
        <div style={{ marginBottom: '15px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Book size={12} /> Estudos Relacionados
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {relatedKnowledge.map(k => (
              <a 
                key={k.id} 
                href={k.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textDecoration: 'none' }}
                className="knowledge-link"
              >
                • {k.title}
              </a>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {project.tech_stack.map((tech) => (
          <span 
            key={tech} 
            style={{ 
              fontSize: '0.75rem', 
              background: 'rgba(0, 198, 255, 0.1)', 
              color: 'var(--primary)',
              padding: '4px 10px', 
              borderRadius: '20px',
              border: '1px solid rgba(0, 198, 255, 0.2)'
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'none' }}>
            <Github size={18} /> Code
          </a>
        )}
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>
            <ExternalLink size={18} /> Live Demo
          </a>
        )}
      </div>

      <style jsx>{`
        .knowledge-link:hover {
          color: var(--accent) !important;
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  )
}
