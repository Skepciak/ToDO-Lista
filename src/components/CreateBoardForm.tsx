'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createBoard } from '@/app/actions/board'

const COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#14b8a6'
]

export function CreateBoardForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [color, setColor] = useState(COLORS[0])

    async function handleSubmit(formData: FormData) {
        setError(null)
        formData.set('color', color)

        startTransition(async () => {
            const result = await createBoard(formData)
            if (result.error) {
                setError(result.error)
            } else if (result.boardId) {
                router.push(`/boards/${result.boardId}`)
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input type="text" name="name" placeholder="Nazwa tablicy" required disabled={isPending} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all" />
                </div>
                <div className="flex-1">
                    <input type="text" name="description" placeholder="Opis (opcjonalnie)" disabled={isPending} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all" />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {COLORS.map((c) => (
                        <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-lg transition-all ${color === c ? 'ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />
                    ))}
                </div>

                <button type="submit" disabled={isPending} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50">
                    {isPending ? 'Tworzenie...' : '+ Utwórz tablicę'}
                </button>
            </div>

            {error && (
                <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
            )}
        </form>
    )
}
