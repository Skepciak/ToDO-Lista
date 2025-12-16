'use client'

import { useState, useEffect } from 'react'

export function NotificationPermission() {
    const [permission, setPermission] = useState<NotificationPermission | null>(null)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        if ('Notification' in window) {
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = async () => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission()
            setPermission(result)
        }
    }

    if (!isClient || !('Notification' in window)) {
        return null
    }

    if (permission === 'granted') {
        return (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Powiadomienia włączone
            </div>
        )
    }

    if (permission === 'denied') {
        return (
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Powiadomienia zablokowane w przeglądarce
            </div>
        )
    }

    return (
        <button onClick={requestPermission} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Włącz powiadomienia
        </button>
    )
}

export function sendNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png'
        })
    }
}

export function scheduleReminder(todoTitle: string, dueDate: Date) {
    const now = new Date()
    const reminderTime = new Date(dueDate.getTime() - 60 * 60 * 1000) // 1 hour before

    if (reminderTime > now) {
        const delay = reminderTime.getTime() - now.getTime()
        setTimeout(() => {
            sendNotification('⏰ Przypomnienie', `Zadanie "${todoTitle}" jest za godzinę!`)
        }, delay)
    }
}
