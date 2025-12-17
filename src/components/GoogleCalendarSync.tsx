'use client'

import { useState, useTransition } from 'react'
import { syncWithGoogleCalendar } from '@/app/actions/googleCalendar'

export function GoogleCalendarSync() {
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState<string | null>(null)

    async function handleSync() {
        setStatus('syncing')
        setMessage(null)

        startTransition(async () => {
            const result = await syncWithGoogleCalendar()

            if (result.success) {
                setStatus('success')
                setMessage(result.message || 'Zsynchronizowano!')
                setTimeout(() => {
                    setStatus('idle')
                    setMessage(null)
                }, 3000)
            } else {
                setStatus('error')
                setMessage(result.error || 'Błąd synchronizacji')
            }
        })
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleSync}
                disabled={isPending || status === 'syncing'}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${status === 'success'
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                        : status === 'error'
                            ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                            : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50'
                    } disabled:opacity-50`}
            >
                <svg className={`w-4 h-4 ${status === 'syncing' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Google Calendar</span>
            </button>
            {message && (
                <span className={`text-sm ${status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {message}
                </span>
            )}
        </div>
    )
}
