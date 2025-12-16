'use server'

import { prisma } from '@/lib/prisma'

interface ExportTodo {
    id: string
    title: string
    description: string | null
    completed: boolean
    priority: string
    dueDate: string | null
    category: string | null
    createdAt: string
}

export async function exportTodosAsJSON() {
    const todos = await prisma.todo.findMany({
        where: { parentId: null },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    })

    const exportData: ExportTodo[] = todos.map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        priority: todo.priority,
        dueDate: todo.dueDate?.toISOString() || null,
        category: todo.category?.name || null,
        createdAt: todo.createdAt.toISOString()
    }))

    return JSON.stringify(exportData, null, 2)
}

export async function exportTodosAsCSV() {
    const todos = await prisma.todo.findMany({
        where: { parentId: null },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    })

    const headers = ['ID', 'Tytuł', 'Opis', 'Ukończone', 'Priorytet', 'Termin', 'Kategoria', 'Data utworzenia']
    const rows = todos.map(todo => [
        todo.id,
        `"${todo.title.replace(/"/g, '""')}"`,
        todo.description ? `"${todo.description.replace(/"/g, '""')}"` : '',
        todo.completed ? 'Tak' : 'Nie',
        todo.priority === 'high' ? 'Wysoki' : todo.priority === 'medium' ? 'Średni' : 'Niski',
        todo.dueDate ? todo.dueDate.toLocaleDateString('pl-PL') : '',
        todo.category?.name || '',
        todo.createdAt.toLocaleDateString('pl-PL')
    ])

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

export async function getStatistics() {
    const todos = await prisma.todo.findMany({
        where: { parentId: null },
        include: { category: true }
    })

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const active = total - completed
    const overdue = todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now).length

    const completedToday = todos.filter(t =>
        t.completed && t.updatedAt >= today
    ).length

    const completedThisWeek = todos.filter(t =>
        t.completed && t.updatedAt >= weekAgo
    ).length

    const completedThisMonth = todos.filter(t =>
        t.completed && t.updatedAt >= monthAgo
    ).length

    const byPriority = {
        high: todos.filter(t => t.priority === 'high').length,
        medium: todos.filter(t => t.priority === 'medium').length,
        low: todos.filter(t => t.priority === 'low').length
    }

    const byCategory: Record<string, number> = {}
    todos.forEach(t => {
        const catName = t.category?.name || 'Bez kategorii'
        byCategory[catName] = (byCategory[catName] || 0) + 1
    })

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
        total,
        completed,
        active,
        overdue,
        completedToday,
        completedThisWeek,
        completedThisMonth,
        byPriority,
        byCategory,
        completionRate
    }
}
