'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function SearchInput() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const currentQuery = searchParams.get('q') || ''
        if (currentQuery !== query) {
            setQuery(currentQuery)
        }
    }, [searchParams])

    const handleSearch = (value: string) => {
        setQuery(value)

        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set('q', value)
            } else {
                params.delete('q')
            }
            router.push(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className="relative">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isPending ? 'text-indigo-500 animate-pulse' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Szukaj zadań..." className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all" />
            {query && (
                <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    )
}
