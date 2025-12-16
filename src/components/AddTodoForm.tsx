'use client'

import { useRef, useState, useTransition } from 'react'
import { createTodo, type Priority } from '@/app/actions/todo'

interface Category {
    id: string
    name: string
    color: string
}

interface AddTodoFormProps {
    categories: Category[]
}

export function AddTodoForm({ categories }: AddTodoFormProps) {
    const formRef = useRef<HTMLFormElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [showOptions, setShowOptions] = useState(false)
    const [priority, setPriority] = useState<Priority>('medium')
    const [dueDate, setDueDate] = useState('')
    const [categoryId, setCategoryId] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setError(null)
        formData.set('priority', priority)
        if (dueDate) formData.set('dueDate', dueDate)
        if (categoryId) formData.set('categoryId', categoryId)

        startTransition(async () => {
            const result = await createTodo(formData)

            if (result.error) {
                setError(result.error)
            } else {
                formRef.current?.reset()
                setPriority('medium')
                setDueDate('')
                setCategoryId(null)
                setShowOptions(false)
            }
        })
    }

    return (
        <form ref={formRef} action={handleSubmit} className="w-full space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <input type="text" name="title" placeholder="Co chcesz zrobić?" disabled={isPending} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all duration-200 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" />
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => setShowOptions(!showOptions)} className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${showOptions ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </button>
                    <button type="submit" disabled={isPending} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isPending ? (
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                        <span className="hidden sm:inline">Dodaj</span>
                    </button>
                </div>
            </div>

            {showOptions && (
                <div className="p-4 bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-600 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Priorytet</label>
                        <div className="flex gap-2">
                            {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                                <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${priority === p ? (p === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 ring-2 ring-red-300 dark:ring-red-700' : p === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 ring-2 ring-yellow-300 dark:ring-yellow-700' : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700') : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'}`}>
                                    {p === 'high' ? '🔴 Wysoki' : p === 'medium' ? '🟡 Średni' : '🟢 Niski'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Termin</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Kategoria</label>
                            <select value={categoryId || ''} onChange={(e) => setCategoryId(e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all">
                                <option value="">Bez kategorii</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </form>
    )
}
