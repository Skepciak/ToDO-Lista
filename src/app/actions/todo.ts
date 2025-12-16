'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type FilterType = 'all' | 'active' | 'completed'
export type Priority = 'high' | 'medium' | 'low'

// ============ TODO ACTIONS ============

export async function getTodos(filter: FilterType = 'all', categoryId?: string, searchQuery?: string) {
    const where: Record<string, unknown> = {}

    if (filter === 'active') where.completed = false
    if (filter === 'completed') where.completed = true
    if (categoryId) where.categoryId = categoryId
    if (searchQuery) where.title = { contains: searchQuery }

    // Only get top-level todos (not subtasks)
    where.parentId = null

    return prisma.todo.findMany({
        where,
        include: {
            category: true,
            subtasks: {
                orderBy: { order: 'asc' }
            }
        },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    })
}

export async function createTodo(formData: FormData) {
    const title = formData.get('title') as string
    const priority = (formData.get('priority') as Priority) || 'medium'
    const dueDateStr = formData.get('dueDate') as string
    const categoryId = formData.get('categoryId') as string
    const parentId = formData.get('parentId') as string

    if (!title || title.trim() === '') {
        return { error: 'Tytuł zadania nie może być pusty' }
    }

    const dueDate = dueDateStr ? new Date(dueDateStr) : null

    await prisma.todo.create({
        data: {
            title: title.trim(),
            priority,
            dueDate,
            categoryId: categoryId || null,
            parentId: parentId || null
        }
    })

    revalidatePath('/')
    return { success: true }
}

export async function updateTodo(id: string, data: {
    title?: string
    description?: string
    priority?: Priority
    dueDate?: Date | null
    categoryId?: string | null
}) {
    if (data.title !== undefined && data.title.trim() === '') {
        return { error: 'Tytuł zadania nie może być pusty' }
    }

    await prisma.todo.update({
        where: { id },
        data: {
            ...(data.title && { title: data.title.trim() }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.priority && { priority: data.priority }),
            ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
            ...(data.categoryId !== undefined && { categoryId: data.categoryId })
        }
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

export async function reorderTodos(orderedIds: string[]) {
    await prisma.$transaction(
        orderedIds.map((id, index) =>
            prisma.todo.update({
                where: { id },
                data: { order: index }
            })
        )
    )

    revalidatePath('/')
    return { success: true }
}

// ============ CATEGORY ACTIONS ============

export async function getCategories() {
    return prisma.category.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string
    const color = formData.get('color') as string || '#6366f1'

    if (!name || name.trim() === '') {
        return { error: 'Nazwa kategorii nie może być pusta' }
    }

    const category = await prisma.category.create({
        data: { name: name.trim(), color }
    })

    revalidatePath('/')
    return { success: true, category }
}

export async function deleteCategory(id: string) {
    // Remove category reference from todos first
    await prisma.todo.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
    })

    await prisma.category.delete({
        where: { id }
    })

    revalidatePath('/')
    return { success: true }
}
