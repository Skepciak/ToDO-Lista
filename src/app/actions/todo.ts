'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type FilterType = 'all' | 'active' | 'completed'

export async function getTodos(filter: FilterType = 'all') {
    const where = filter === 'all'
        ? {}
        : filter === 'active'
            ? { completed: false }
            : { completed: true }

    return prisma.todo.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    })
}

export async function createTodo(formData: FormData) {
    const title = formData.get('title') as string

    if (!title || title.trim() === '') {
        return { error: 'Tytuł zadania nie może być pusty' }
    }

    await prisma.todo.create({
        data: { title: title.trim() }
    })

    revalidatePath('/')
    return { success: true }
}

export async function toggleTodo(id: string) {
    const todo = await prisma.todo.findUnique({ where: { id } })

    if (!todo) {
        return { error: 'Zadanie nie zostało znalezione' }
    }

    await prisma.todo.update({
        where: { id },
        data: { completed: !todo.completed }
    })

    revalidatePath('/')
    return { success: true }
}

export async function deleteTodo(id: string) {
    await prisma.todo.delete({
        where: { id }
    })

    revalidatePath('/')
    return { success: true }
}
