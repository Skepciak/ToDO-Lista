'use client'

import { useState, useTransition } from 'react'
import { inviteToBoard } from '@/app/actions/board'

export function InviteMemberForm({ boardId }: { boardId: string }) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string

        if (!email) return

        startTransition(async () => {
            const result = await inviteToBoard(boardId, email)
            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else {
                setMessage({ type: 'success', text: `Zaproszenie wysłane do ${email}` })
                e.currentTarget.reset()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input type="email" name="email" placeholder="Email użytkownika" required disabled={isPending} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 outline-none transition-all text-sm" />
            <button type="submit" disabled={isPending} className="w-full px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-all disabled:opacity-50 text-sm">
                {isPending ? 'Wysyłanie...' : '📧 Wyślij zaproszenie'}
            </button>
            {message && (
                <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                    {message.text}
                </p>
            )}
        </form>
    )
}
