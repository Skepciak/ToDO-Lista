'use client'

import { useState } from 'react'
import { createCategory } from '@/app/actions/todo'

interface Category {
    id: string
    name: string
    color: string
}

interface CategorySelectProps {
    categories: Category[]
    selectedId?: string | null
    onChange: (categoryId: string | null) => void
    showCreate?: boolean
}

const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4'
]

export function CategorySelect({ categories, selectedId, onChange, showCreate = true }: CategorySelectProps) {
    const [isCreating, setIsCreating] = useState(false)
    const [newName, setNewName] = useState('')
    const [newColor, setNewColor] = useState(colors[0])

    async function handleCreate() {
        if (!newName.trim()) return

        const formData = new FormData()
        formData.set('name', newName)
        formData.set('color', newColor)

        const result = await createCategory(formData)
        if (result.success && result.category) {
            onChange(result.category.id)
            setNewName('')
            setIsCreating(false)
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedId ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    Brak
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onChange(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${selectedId === cat.id ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                        style={{
                            backgroundColor: `${cat.color}20`,
                            color: cat.color,
                            borderColor: cat.color,
                            ...(selectedId === cat.id && { ringColor: cat.color })
                        }}
                    >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                    </button>
                ))}
                {showCreate && (
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                    >
                        + Nowa
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nazwa kategorii"
                        className="flex-1 min-w-[120px] px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <div className="flex gap-1">
                        {colors.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setNewColor(c)}
                                className={`w-6 h-6 rounded-full transition-all ${newColor === c ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="px-3 py-1.5 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    >
                        Dodaj
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        Anuluj
                    </button>
                </div>
            )}
        </div>
    )
}
