'use client'

import { useState, useTransition } from 'react'
import { exportToIcal } from '@/app/actions/calendar'

export function CalendarExport() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<string | null>(null)

    function downloadFile(content: string, filename: string, type: string) {
        const blob = new Blob([content], { type })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    function handleExport() {
        startTransition(async () => {
            const data = await exportToIcal()
            downloadFile(data, `zadania_${new Date().toISOString().split('T')[0]}.ics`, 'text/calendar')
            setMessage('Wyeksportowano do kalendarza!')
            setTimeout(() => setMessage(null), 3000)
        })
    }

    return (
        <div className="flex items-center gap-2">
            <button onClick={handleExport} disabled={isPending} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all disabled:opacity-50 flex items-center gap-1.5">
                <span>🍎</span>
                <span>Apple Calendar</span>
            </button>
            {message && (
                <span className="text-sm text-green-600 dark:text-green-400">{message}</span>
            )}
        </div>
    )
}
