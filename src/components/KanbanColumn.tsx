'use client'
import { KanbanTask, KanbanStatus } from '@/types'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanTaskCard from './KanbanTaskCard'

interface KanbanColumnProps {
  status: KanbanStatus
  tasks: KanbanTask[]
  onEdit?: (task: KanbanTask) => void
  onDelete?: (id: string) => void
  isDraggable?: boolean
}

export default function KanbanColumn({ status, tasks, onEdit, onDelete, isDraggable = true }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status, disabled: !isDraggable })

  const content = (
    <div 
      ref={setNodeRef} 
      style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}
    >
      {tasks.map(task => (
        <KanbanTaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} isDraggable={isDraggable} />
      ))}
    </div>
  )

  return (
    <div className="glass" style={{ padding: '20px', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ 
        fontSize: '1.2rem', 
        marginBottom: '20px', 
        textAlign: 'center',
        paddingBottom: '10px',
        borderBottom: '1px solid var(--border)'
      }}>
        {status}
      </h3>
      
      {isDraggable ? (
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {content}
        </SortableContext>
      ) : content}
    </div>
  )
}
