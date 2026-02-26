/**
 * Quadro Kanban interativo com funcionalidade Drag-and-Drop.
 * Sincroniza o estado das tarefas e a ordem de exibição com o Supabase.
 */
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { KanbanTask, KanbanStatus } from '@/types'
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable'
import KanbanColumn from './KanbanColumn'
import KanbanTaskCard from './KanbanTaskCard'

const COLUMNS: KanbanStatus[] = ['A Fazer', 'Em Progresso', 'Concluído']

const MOCK_TASKS: KanbanTask[] = [
  {
    id: 't1',
    title: 'Estudar Next.js App Router',
    description: 'Aprofundar em Server Components e Data Fetching.',
    status: 'Em Progresso',
    priority: 'Alta',
    task_order: 1,
    due_date: '2026-03-01',
    created_at: new Date().toISOString()
  },
  {
    id: 't2',
    title: 'Configurar RLS no Supabase',
    description: 'Garantir que as tabelas de contatos tenham permissão de insert.',
    status: 'A Fazer',
    priority: 'Média',
    task_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 't3',
    title: 'Finalizar Landing Page',
    description: 'Revisar responsividade e performance.',
    status: 'Concluído',
    priority: 'Baixa',
    task_order: 3,
    created_at: new Date().toISOString()
  }
]

interface KanbanBoardProps {
  tasks?: KanbanTask[]
  onEditTask?: (task: KanbanTask) => void
  onDeleteTask?: (id: string) => void
  onTasksChange?: (newTasks: KanbanTask[]) => void
  isDraggable?: boolean
}

export default function KanbanBoard({ 
  tasks: propsTasks, 
  onEditTask, 
  onDeleteTask, 
  onTasksChange,
  isDraggable = true 
}: KanbanBoardProps) {
  const [internalTasks, setInternalTasks] = useState<KanbanTask[]>([])
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)
  const [loading, setLoading] = useState(!propsTasks)

  const tasks = propsTasks || internalTasks

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    if (propsTasks) {
      setLoading(false)
      return
    }

    async function fetchTasks() {
      setLoading(true)
      const { data, error } = await supabase
        .from('kanban_tasks')
        .select('*')
        .order('task_order', { ascending: true })

      if (error || !data || data.length === 0) {
        setInternalTasks(MOCK_TASKS)
      } else {
        setInternalTasks(data as KanbanTask[])
      }
      setLoading(false)
    }
    fetchTasks()
  }, [propsTasks])

  const onDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeTask = tasks.find(t => t.id === activeId)
    const overTask = tasks.find(t => t.id === overId)

    const isOverAColumn = COLUMNS.includes(overId as KanbanStatus)

    if (activeTask && (overTask || isOverAColumn)) {
      const newStatus = isOverAColumn ? (overId as KanbanStatus) : overTask!.status

      if (activeTask.status !== newStatus) {
        const activeIndex = tasks.findIndex(t => t.id === activeId)
        const newTasks = [...tasks]
        newTasks[activeIndex] = { ...activeTask, status: newStatus }
        
        if (propsTasks) {
          onTasksChange?.(newTasks)
        } else {
          setInternalTasks(newTasks)
        }
      }
    }
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const oldIndex = tasks.findIndex(t => t.id === activeId)
    const activeTask = tasks[oldIndex]
    
    // Check if it's dropped over a column or another task
    const isOverAColumn = COLUMNS.includes(overId as KanbanStatus)
    const newStatus = isOverAColumn ? (overId as KanbanStatus) : tasks.find(t => t.id === overId)!.status
    
    let newTasks = [...tasks]
    
    if (activeId !== overId) {
      const newIndex = isOverAColumn 
        ? newTasks.filter(t => t.status === newStatus).length 
        : tasks.findIndex(t => t.id === overId)
        
      newTasks = arrayMove(tasks, oldIndex, newIndex)
      // Update status for the moved task in the new array
      const movedTaskIndex = newTasks.findIndex(t => t.id === activeId)
      newTasks[movedTaskIndex] = { ...newTasks[movedTaskIndex], status: newStatus }
    } else if (activeTask.status !== newStatus) {
      // Just status change (dragged to column header of same status or something similar)
      const index = newTasks.findIndex(t => t.id === activeId)
      newTasks[index] = { ...activeTask, status: newStatus }
    }

    if (propsTasks) {
      onTasksChange?.(newTasks)
    } else {
      setInternalTasks(newTasks)
      
      // Sync with Supabase
      const task = newTasks.find(t => t.id === activeId)
      if (task) {
        // Update the task itself
        const { error } = await supabase.from('kanban_tasks').update({ 
          status: task.status,
          task_order: newTasks.indexOf(task) 
        }).eq('id', task.id)

        // Log activity if completed
        if (!error && task.status === 'Concluído' && activeTask.status !== 'Concluído') {
          await supabase.from('activity_log').insert({
            type: 'kanban',
            action: 'complete',
            description: `Completou a tarefa: ${task.title}`,
            metadata: { task_id: task.id }
          })
        }
        
        // Optionally update other tasks orders if they shifted significantly
        // For now, updating the single task is a good start for Alpha/Beta
      }
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando planejamento...</div>

  const boardContent = (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '20px',
      alignItems: 'flex-start'
    }}>
      {COLUMNS.map(status => (
        <KanbanColumn 
          key={status} 
          status={status} 
          tasks={tasks.filter(t => t.status === status)} 
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          isDraggable={isDraggable}
        />
      ))}
    </div>
  )

  if (!isDraggable) return boardContent

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {boardContent}

      <DragOverlay>
        {activeTask ? <KanbanTaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
