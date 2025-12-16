'use client'

import { useState, useTransition } from 'react'
import { updateTodo, deleteTodo, type Priority } from '@/app/actions/todo'
import { CategorySelect } from './CategorySelect'

interface Category {
    id: string
    name: string
    color: string
}

interface Todo {
    id: string
    title: string
    description?: string | null
    priority: string
    dueDate?: Date | null
    categoryId?: string | null
    category?: Category | null
}

interface EditTodoModalProps {
    todo: Todo
    categories: Category[]
    onClose: () => void
}

export function EditTodoModal({ todo, categories, onClose }: EditTodoModalProps) {
    const [title, setTitle] = useState(todo.title)
    const [description, setDescription] = useState(todo.description || '')
    const [priority, setPriority] = useState<Priority>(todo.priority as Priority)
    const [dueDate, setDueDate] = useState(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '')
    const [categoryId, setCategoryId] = useState<string | null>(todo.categoryId || null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        startTransition(async () => {
            const result = await updateTodo(todo.id, {
                title,
                description: description || null,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                categoryId
            })

            if (result.error) {
                setError(result.error)
            } else {
                onClose()
            }
        })
    }

    async function handleDelete() {
        if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
            startTransition(async () => {
                await deleteTodo(todo.id)
                onClose()
            })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Edytuj zadanie</h2>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tytuł</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Opis (opcjonalnie)</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={isPending} rows={3} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none" placeholder="Dodaj szczegóły..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priorytet</label>
                            <div className="flex gap-2">
                                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                                    <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-lg font-medium transition-all ${priority === p ? (p === 'high' ? 'bg-red-100 text-red-700 ring-2 ring-red-300' : p === 'medium' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300' : 'bg-green-100 text-green-700 ring-2 ring-green-300') : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                        {p === 'high' ? 'Wysoki' : p === 'medium' ? 'Średni' : 'Niski'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Termin</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={isPending} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                            <CategorySelect categories={categories} selectedId={categoryId} onChange={setCategoryId} />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={handleDelete} disabled={isPending} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all">
                                Usuń
                            </button>
                            <div className="flex-1" />
                            <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-all">
                                Anuluj
                            </button>
                            <button type="submit" disabled={isPending} className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all">
                                {isPending ? 'Zapisywanie...' : 'Zapisz'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
