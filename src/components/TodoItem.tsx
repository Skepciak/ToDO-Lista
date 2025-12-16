'use client'

import { useTransition } from 'react'
import { toggleTodo, deleteTodo } from '@/app/actions/todo'

interface TodoItemProps {
    id: string
    title: string
    completed: boolean
}

export function TodoItem({ id, title, completed }: TodoItemProps) {
    const [isPending, startTransition] = useTransition()

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

    const containerClass = `group flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border-2 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-indigo-500/10 ${completed ? 'border-green-200 bg-green-50/50' : 'border-gray-100 hover:border-indigo-200'} ${isPending ? 'opacity-50' : 'opacity-100'}`

    const checkboxClass = `flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${completed ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'}`

    const titleClass = `flex-1 text-lg transition-all duration-200 ${completed ? 'text-gray-400 line-through' : 'text-gray-700'}`

    return (
        <div className={containerClass}>
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={checkboxClass}
                aria-label={completed ? 'Oznacz jako niewykonane' : 'Oznacz jako wykonane'}
            >
                {completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            <span className={titleClass}>{title}</span>

            <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:cursor-not-allowed"
                aria-label="Usuń zadanie"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    )
}
