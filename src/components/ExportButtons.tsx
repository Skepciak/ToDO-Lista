'use client'

import { useState, useTransition } from 'react'
import { exportTodosAsJSON, exportTodosAsCSV } from '@/app/actions/export'

export function ExportButtons() {
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

    function handleExportJSON() {
        startTransition(async () => {
            const data = await exportTodosAsJSON()
            downloadFile(data, `zadania_${new Date().toISOString().split('T')[0]}.json`, 'application/json')
            setMessage('Wyeksportowano do JSON!')
            setTimeout(() => setMessage(null), 2000)
        })
    }

    function handleExportCSV() {
        startTransition(async () => {
            const data = await exportTodosAsCSV()
            downloadFile(data, `zadania_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
            setMessage('Wyeksportowano do CSV!')
            setTimeout(() => setMessage(null), 2000)
        })
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <button onClick={handleExportJSON} disabled={isPending} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-all disabled:opacity-50">
                📄 JSON
            </button>
            <button onClick={handleExportCSV} disabled={isPending} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50 transition-all disabled:opacity-50">
                📊 CSV
            </button>
            {message && (
                <span className="text-sm text-green-600 dark:text-green-400">{message}</span>
            )}
        </div>
    )
}
