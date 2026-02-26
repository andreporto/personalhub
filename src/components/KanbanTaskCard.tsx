'use client'
import { KanbanTask } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, GripVertical, Edit2, Trash2 } from 'lucide-react'

interface KanbanTaskCardProps {
  task: KanbanTask
  isOverlay?: boolean
  onEdit?: (task: KanbanTask) => void
  onDelete?: (id: string) => void
  isDraggable?: boolean
}

export default function KanbanTaskCard({ task, isOverlay, onEdit, onDelete, isDraggable = true }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: !isDraggable })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'default',
  }

  const priorityColors = {
    Baixa: '#00ff9d',
    Média: '#ffbe0b',
    Alta: '#ff0066'
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="glass"
      {...attributes}
    >
      <div style={{ padding: '15px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: priorityColors[task.priority],
              border: `1px solid ${priorityColors[task.priority]}`,
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {task.priority}
            </span>
            {(onEdit || onDelete) && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {onEdit && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(task); }} 
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary)', cursor: 'pointer', display: 'flex' }}
                  >
                    <Edit2 size={14} />
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
                    style={{ background: 'none', border: 'none', padding: 0, color: '#ff4b4b', cursor: 'pointer', display: 'flex' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
          {isDraggable && (
            <div {...listeners} style={{ cursor: 'grab', color: 'var(--text-dim)' }}>
              <GripVertical size={16} />
            </div>
          )}
        </div>

        <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '8px', background: 'none' }}>{task.title}</h4>
        
        {task.description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
            {task.description}
          </p>
        )}

        {task.due_date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--primary)' }}>
            <Calendar size={14} />
            {new Date(task.due_date).toLocaleDateString('pt-BR')}
          </div>
        )}
      </div>
    </div>
  )
}
