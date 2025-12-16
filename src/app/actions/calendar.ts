'use server'

import { prisma } from '@/lib/prisma'

// Generate iCal format for Apple Calendar
export async function exportToIcal() {
    const todos = await prisma.todo.findMany({
        where: {
            parentId: null,
            dueDate: { not: null }
        },
        orderBy: { dueDate: 'asc' }
    })

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ToDo Lista//Todo App//PL',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:ToDo Lista'
    ]

    todos.forEach(todo => {
        if (!todo.dueDate) return

        const uid = `${todo.id}@todolist.local`
        const dtstamp = formatIcalDate(new Date())
        const dtstart = formatIcalDate(todo.dueDate)
        const dtend = formatIcalDate(new Date(todo.dueDate.getTime() + 60 * 60 * 1000)) // 1 hour duration

        const status = todo.completed ? 'COMPLETED' : 'CONFIRMED'
        const priority = todo.priority === 'high' ? 1 : todo.priority === 'medium' ? 5 : 9

        lines.push('BEGIN:VEVENT')
        lines.push(`UID:${uid}`)
        lines.push(`DTSTAMP:${dtstamp}`)
        lines.push(`DTSTART:${dtstart}`)
        lines.push(`DTEND:${dtend}`)
        lines.push(`SUMMARY:${escapeIcal(todo.title)}`)
        if (todo.description) {
            lines.push(`DESCRIPTION:${escapeIcal(todo.description)}`)
        }
        lines.push(`STATUS:${status}`)
        lines.push(`PRIORITY:${priority}`)

        // Add alarm 1 hour before
        lines.push('BEGIN:VALARM')
        lines.push('TRIGGER:-PT1H')
        lines.push('ACTION:DISPLAY')
        lines.push(`DESCRIPTION:Przypomnienie: ${escapeIcal(todo.title)}`)
        lines.push('END:VALARM')

        lines.push('END:VEVENT')
    })

    lines.push('END:VCALENDAR')

    return lines.join('\r\n')
}

function formatIcalDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeIcal(text: string): string {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n')
}

// Email settings interface
export interface EmailSettings {
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPass: string
    fromEmail: string
    toEmail: string
}

// Check if email is configured (via environment variables)
export async function isEmailConfigured(): Promise<boolean> {
    return !!(
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        process.env.EMAIL_FROM &&
        process.env.EMAIL_TO
    )
}

// This would send email if configured - placeholder for now
export async function sendReminderEmail(todoTitle: string, dueDate: Date): Promise<{ success: boolean; error?: string }> {
    const configured = await isEmailConfigured()

    if (!configured) {
        return {
            success: false,
            error: 'Email nie jest skonfigurowany. Dodaj SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_TO do .env'
        }
    }

    // In a real implementation, you would use nodemailer here:
    // const nodemailer = require('nodemailer')
    // const transporter = nodemailer.createTransport({...})
    // await transporter.sendMail({...})

    console.log(`[EMAIL] Would send reminder for: ${todoTitle} due at ${dueDate.toLocaleString('pl-PL')}`)

    return { success: true }
}
