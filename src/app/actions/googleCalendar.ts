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

    if (!account?.access_token) {
        return { success: false, error: 'Połącz konto z Google (zaloguj przez Google)' }
    }

    // Get todos with due dates that need syncing
    const todos = await prisma.todo.findMany({
        where: {
            userId: session.user.id,
            dueDate: { not: null },
            completed: false
        }
    })

    if (todos.length === 0) {
        return { success: true, message: 'Brak zadań do synchronizacji' }
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
            let response: Response

            if (todo.googleEventId) {
                // Update existing event
                response = await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${todo.googleEventId}`,
                    {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${account.access_token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(event)
                    }
                )
            } else {
                // Create new event
                response = await fetch(
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
            }

            if (response.ok) {
                const data = await response.json()

                // Save Google Event ID for future updates
                if (!todo.googleEventId) {
                    await prisma.todo.update({
                        where: { id: todo.id },
                        data: { googleEventId: data.id }
                    })
                }

                synced++
            } else {
                console.error('Google Calendar API error:', await response.text())
                errors++
            }
        } catch (error) {
            console.error('Sync error:', error)
            errors++
        }
    }

    if (errors > 0) {
        return {
            success: true,
            message: `Zsynchronizowano ${synced}/${todos.length} (${errors} błędów)`
        }
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
