'use client'

import { useState, useTransition } from 'react'
import { toggleTodo, deleteTodo } from '@/app/actions/todo'
import { PriorityBadge } from './PriorityBadge'
import { CategoryBadge } from './CategoryBadge'
import { EditTodoModal } from './EditTodoModal'
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

interface TodoItemProps {
    id: string
    title: string
    description?: string | null
    completed: boolean
    priority: string
    dueDate?: Date | string | null
    category?: Category | null
    categoryId?: string | null
    subtasks?: Subtask[]
    categories: Category[]
}

export function TodoItem({ id, title, description, completed, priority, dueDate, category, categoryId, subtasks, categories }: TodoItemProps) {
    const [isPending, startTransition] = useTransition()
    const [isEditing, setIsEditing] = useState(false)

    function handleToggle() {
        startTransition(() => {
            toggleTodo(id)
        })
    }

    function handleDelete() {
        startTransition(() => {
            deleteTodo(id)
        })
    }

    const isOverdue = dueDate && new Date(dueDate) < new Date() && !completed
    const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }) : null

    return (
        <>
            <div className={`group flex flex-col gap-2 p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-indigo-500/10 ${completed ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20' : isOverdue ? 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700'} ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex items-start gap-3">
                    <button onClick={handleToggle} disabled={isPending} className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${completed ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`} aria-label={completed ? 'Oznacz jako niewykonane' : 'Oznacz jako wykonane'}>
                        {completed && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-lg transition-all duration-200 ${completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                {title}
                            </span>
                            <PriorityBadge priority={priority as Priority} />
                            {category && <CategoryBadge name={category.name} color={category.color} />}
                        </div>

                        {description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                        )}

                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {formattedDate && (
                                <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formattedDate}
                                    {isOverdue && ' (przeterminowane)'}
                                </span>
                            )}
                            {subtasks && subtasks.length > 0 && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    {subtasks.filter(s => s.completed).length}/{subtasks.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsEditing(true)} disabled={isPending} className="p-2 rounded-lg text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all" aria-label="Edytuj">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onClick={handleDelete} disabled={isPending} className="p-2 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all" aria-label="Usuń">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isEditing && (
                <EditTodoModal
                    todo={{ id, title, description, priority, dueDate: dueDate ? new Date(dueDate) : null, categoryId: categoryId || null, category }}
                    categories={categories}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    )
}
