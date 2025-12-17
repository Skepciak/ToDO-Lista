'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Get user's boards (owned + member of)
export async function getBoards() {
    const session = await auth()
    if (!session?.user?.id) return []

    const boards = await prisma.board.findMany({
        where: {
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        },
        include: {
            owner: { select: { name: true, email: true } },
            members: { include: { user: { select: { name: true, email: true } } } },
            _count: { select: { todos: true } }
        },
        orderBy: { updatedAt: 'desc' }
    })

    return boards
}

// Get single board with todos
export async function getBoard(boardId: string) {
    const session = await auth()
    if (!session?.user?.id) return null

    const board = await prisma.board.findFirst({
        where: {
            id: boardId,
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        },
        include: {
            owner: { select: { id: true, name: true, email: true } },
            members: { include: { user: { select: { id: true, name: true, email: true } } } },
            todos: {
                where: { parentId: null },
                include: { category: true, subtasks: true },
                orderBy: { order: 'asc' }
            },
            invites: {
                where: { usedAt: null, expiresAt: { gt: new Date() } }
            }
        }
    })

    return board
}

// Create new board
export async function createBoard(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'Musisz być zalogowany' }
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const color = formData.get('color') as string || '#6366f1'

    if (!name || name.trim().length < 2) {
        return { error: 'Nazwa tablicy musi mieć minimum 2 znaki' }
    }

    const board = await prisma.board.create({
        data: {
            name: name.trim(),
            description: description?.trim() || null,
            color,
            ownerId: session.user.id,
            members: {
                create: {
                    userId: session.user.id,
                    role: 'owner'
                }
            }
        }
    })

    revalidatePath('/boards')
    return { success: true, boardId: board.id }
}

// Invite user to board
export async function inviteToBoard(boardId: string, email: string, role: string = 'member') {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'Musisz być zalogowany' }
    }

    // Check if user is owner/admin of board
    const board = await prisma.board.findFirst({
        where: {
            id: boardId,
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id, role: { in: ['owner', 'admin'] } } } }
            ]
        }
    })

    if (!board) {
        return { error: 'Nie masz uprawnień do zapraszania' }
    }

    // Check if user already a member
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        const existingMember = await prisma.boardMember.findUnique({
            where: { boardId_userId: { boardId, userId: existingUser.id } }
        })
        if (existingMember) {
            return { error: 'Ten użytkownik jest już członkiem tablicy' }
        }
    }

    // Create invitation
    const invite = await prisma.boardInvite.create({
        data: {
            email,
            role,
            boardId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
    })

    // TODO: Send email with invitation link
    console.log(`[Invite] Send email to ${email} with link: /boards/join/${invite.token}`)

    revalidatePath(`/boards/${boardId}`)
    return { success: true, token: invite.token }
}

// Accept invitation
export async function acceptInvite(token: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'Musisz być zalogowany', redirectTo: `/login?callbackUrl=/boards/join/${token}` }
    }

    const invite = await prisma.boardInvite.findUnique({
        where: { token },
        include: { board: true }
    })

    if (!invite) {
        return { error: 'Zaproszenie nie istnieje' }
    }

    if (invite.usedAt) {
        return { error: 'Zaproszenie zostało już wykorzystane' }
    }

    if (invite.expiresAt < new Date()) {
        return { error: 'Zaproszenie wygasło' }
    }

    // Check if already a member
    const existingMember = await prisma.boardMember.findUnique({
        where: { boardId_userId: { boardId: invite.boardId, userId: session.user.id } }
    })

    if (existingMember) {
        return { success: true, boardId: invite.boardId, message: 'Już jesteś członkiem tej tablicy' }
    }

    // Add user as member
    await prisma.$transaction([
        prisma.boardMember.create({
            data: {
                boardId: invite.boardId,
                userId: session.user.id,
                role: invite.role
            }
        }),
        prisma.boardInvite.update({
            where: { id: invite.id },
            data: { usedAt: new Date() }
        })
    ])

    revalidatePath(`/boards/${invite.boardId}`)
    return { success: true, boardId: invite.boardId }
}

// Add todo to board
export async function addTodoToBoard(boardId: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'Musisz być zalogowany' }
    }

    const title = formData.get('title') as string
    if (!title?.trim()) {
        return { error: 'Tytuł jest wymagany' }
    }

    // Check board access
    const member = await prisma.boardMember.findFirst({
        where: { boardId, userId: session.user.id }
    })

    if (!member) {
        return { error: 'Nie masz dostępu do tej tablicy' }
    }

    const todo = await prisma.todo.create({
        data: {
            title: title.trim(),
            boardId,
            userId: session.user.id
        }
    })

    revalidatePath(`/boards/${boardId}`)
    return { success: true, todoId: todo.id }
}

// Delete board
export async function deleteBoard(boardId: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: 'Musisz być zalogowany' }
    }

    const board = await prisma.board.findFirst({
        where: { id: boardId, ownerId: session.user.id }
    })

    if (!board) {
        return { error: 'Nie masz uprawnień do usunięcia tej tablicy' }
    }

    await prisma.board.delete({ where: { id: boardId } })

    revalidatePath('/boards')
    return { success: true }
}
