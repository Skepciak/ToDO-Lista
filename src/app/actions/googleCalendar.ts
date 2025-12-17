'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface CalendarEvent {
    summary: string
    description?: string
    start: { dateTime: string; timeZone: string }
    end: { dateTime: string; timeZone: string }
}

export async function syncWithGoogleCalendar(): Promise<{ success: boolean; message?: string; error?: string }> {
    const session = await auth()

    if (!session?.user?.id) {
        return { success: false, error: 'Musisz być zalogowany' }
    }

    // Get user's Google account with access token
    const account = await prisma.account.findFirst({
        where: {
            userId: session.user.id,
            provider: 'google'
        }
    })

    console.log('[Calendar] User ID:', session.user.id)
    console.log('[Calendar] Account found:', !!account)
    console.log('[Calendar] Access token exists:', !!account?.access_token)

    if (!account?.access_token) {
        return { success: false, error: 'Połącz konto z Google (wyloguj i zaloguj ponownie przez Google)' }
    }

    // Get ALL todos with due dates (not filtering by userId to catch todos created before auth was added)
    const todos = await prisma.todo.findMany({
        where: {
            dueDate: { not: null },
            completed: false,
            parentId: null // Only main todos, not subtasks
        }
    })

    console.log('[Calendar] Found todos with due dates:', todos.length)

    if (todos.length === 0) {
        return { success: true, message: 'Brak zadań z terminem do synchronizacji' }
    }

    let synced = 0
    let errors = 0

    for (const todo of todos) {
        if (!todo.dueDate) continue

        const event: CalendarEvent = {
            summary: todo.title,
            description: todo.description || undefined,
            start: {
                dateTime: todo.dueDate.toISOString(),
                timeZone: 'Europe/Warsaw'
            },
            end: {
                dateTime: new Date(todo.dueDate.getTime() + 60 * 60 * 1000).toISOString(),
                timeZone: 'Europe/Warsaw'
            }
        }

        try {
            console.log('[Calendar] Syncing:', todo.title)

            // Always create new event (simpler than tracking googleEventId)
            const response = await fetch(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${account.access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(event)
                }
            )

            const responseText = await response.text()
            console.log('[Calendar] API response status:', response.status)

            if (response.ok) {
                synced++
                console.log('[Calendar] Synced:', todo.title)
            } else {
                console.error('[Calendar] API error:', responseText)

                // Check if token expired
                if (response.status === 401) {
                    return { success: false, error: 'Token wygasł - wyloguj i zaloguj ponownie przez Google' }
                }

                errors++
            }
        } catch (error) {
            console.error('[Calendar] Sync error:', error)
            errors++
        }
    }

    if (errors > 0 && synced === 0) {
        return { success: false, error: `Błąd synchronizacji (${errors} błędów). Sprawdź czy Google Calendar API jest włączone.` }
    }

    if (errors > 0) {
        return { success: true, message: `Zsynchronizowano ${synced}/${todos.length} (${errors} błędów)` }
    }

    return { success: true, message: `Zsynchronizowano ${synced} zadań` }
}

export async function isGoogleConnected(): Promise<boolean> {
    const session = await auth()

    if (!session?.user?.id) return false

    const account = await prisma.account.findFirst({
        where: {
            userId: session.user.id,
            provider: 'google'
        }
    })

    return !!account?.access_token
}
