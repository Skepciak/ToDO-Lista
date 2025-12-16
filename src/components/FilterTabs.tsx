'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { FilterType } from '@/app/actions/todo'

const filters: { type: FilterType; label: string }[] = [
    { type: 'all', label: 'Wszystkie' },
    { type: 'active', label: 'Aktywne' },
    { type: 'completed', label: 'Zakończone' },
]

export function FilterTabs() {
    const searchParams = useSearchParams()
    const currentFilter = (searchParams.get('filter') as FilterType) || 'all'
    const searchQuery = searchParams.get('q')

    const buildHref = (type: FilterType) => {
        const params = new URLSearchParams()
        if (type !== 'all') params.set('filter', type)
        if (searchQuery) params.set('q', searchQuery)
        return params.toString() ? `/?${params.toString()}` : '/'
    }

    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {filters.map(({ type, label }) => {
                const isActive = currentFilter === type

                return (
                    <Link
                        key={type}
                        href={buildHref(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-600'}`}
                    >
                        {label}
                    </Link>
                )
            })}
        </div>
    )
}
