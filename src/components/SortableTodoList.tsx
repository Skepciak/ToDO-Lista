'use client'

import { useState, useTransition } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { reorderTodos } from '@/app/actions/todo'
import { TodoItem } from './TodoItem'
import type { Priority } from '@/app/actions/todo'

interface Category {
    id: string
    name: string
    color: string
}

interface Subtask {
    id: string
    title: string
    completed: boolean
}

interface Todo {
    id: string
    title: string
    description?: string | null
    completed: boolean
    priority: string
    dueDate?: Date | null
    category?: Category | null
    categoryId?: string | null
    subtasks?: Subtask[]
}

interface SortableTodoListProps {
    todos: Todo[]
    categories: Category[]
}

function SortableTodoItem({ todo, categories }: { todo: Todo; categories: Category[] }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto'
    }

    return (
        <div ref={setNodeRef} style={style} className="relative">
            <div {...attributes} {...listeners} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                </svg>
            </div>
            <TodoItem key={todo.id} id={todo.id} title={todo.title} description={todo.description} completed={todo.completed} priority={todo.priority} dueDate={todo.dueDate} category={todo.category} categoryId={todo.categoryId} subtasks={todo.subtasks} categories={categories} />
        </div>
    )
}

export function SortableTodoList({ todos, categories }: SortableTodoListProps) {
    const [items, setItems] = useState(todos)
    const [isPending, startTransition] = useTransition()

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    // Sync with server data
    if (JSON.stringify(todos.map(t => t.id)) !== JSON.stringify(items.map(t => t.id))) {
        setItems(todos)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(t => t.id === active.id)
            const newIndex = items.findIndex(t => t.id === over.id)

            const newItems = [...items]
            const [removed] = newItems.splice(oldIndex, 1)
            newItems.splice(newIndex, 0, removed)

            setItems(newItems)

            startTransition(async () => {
                await reorderTodos(newItems.map(t => t.id))
            })
        }
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <svg className="w-12 h-12 text-indigo-300 dark:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Brak zadań</h3>
                <p className="text-gray-400 dark:text-gray-500">Dodaj swoje pierwsze zadanie powyżej!</p>
            </div>
        )
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className={`space-y-3 ${isPending ? 'opacity-70' : ''}`}>
                    {items.map((todo) => (
                        <SortableTodoItem key={todo.id} todo={todo} categories={categories} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
