import { auth, signOut } from '@/auth'
import Link from 'next/link'

export async function AuthButtons() {
    const session = await auth()

    if (session?.user) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                    {session.user.name || session.user.email}
                </span>
                {session.user.role === 'admin' && (
                    <Link href="/admin" className="px-3 py-1.5 text-sm font-medium rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all">
                        👑 Admin
                    </Link>
                )}
                <form action={async () => {
                    'use server'
                    await signOut({ redirectTo: '/login' })
                }}>
                    <button type="submit" className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50 transition-all">
                        Wyloguj
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                Zaloguj
            </Link>
            <Link href="/register" className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all">
                Rejestracja
            </Link>
        </div>
    )
}
