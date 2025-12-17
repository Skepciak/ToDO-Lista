'use client'

import { useState, useTransition } from 'react'
import { addTodoToBoard } from '@/app/actions/board'

export function BoardTodoForm({ boardId }: { boardId: string }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setError(null)

        startTransition(async () => {
            const result = await addTodoToBoard(boardId, formData)
            if (result.error) {
                setError(result.error)
            }
        })
    }

    return (
        <form action={handleSubmit} className="flex gap-2">
            <input type="text" name="title" placeholder="Nowe zadanie..." required disabled={isPending} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all" />
            <button type="submit" disabled={isPending} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50">
                {isPending ? '...' : '+'}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    )
}
