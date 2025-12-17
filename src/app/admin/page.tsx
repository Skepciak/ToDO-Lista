import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
        redirect('/')
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { todos: true }
            }
        }
    })

    const stats = {
        totalUsers: users.length,
        totalTodos: await prisma.todo.count(),
        completedTodos: await prisma.todo.count({ where: { completed: true } }),
        activeUsers: users.filter(u => u._count.todos > 0).length
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            👑 Panel Administratora
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Zarządzaj użytkownikami i aplikacją</p>
                    </div>
                    <Link href="/" className="px-4 py-2 text-sm font-medium rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        ← Powrót
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Użytkownicy" value={stats.totalUsers} icon="👥" />
                    <StatCard title="Wszystkie zadania" value={stats.totalTodos} icon="📋" />
                    <StatCard title="Ukończone" value={stats.completedTodos} icon="✅" />
                    <StatCard title="Aktywni" value={stats.activeUsers} icon="🎯" />
                </div>

                {/* Users table */}
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Lista użytkowników</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Użytkownik</th>
                                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Email</th>
                                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Rola</th>
                                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Zadania</th>
                                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Data rejestracji</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                {user.image ? (
                                                    <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                        {user.name?.[0] || user.email[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-gray-800 dark:text-gray-200">{user.name || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                                {user.role === 'admin' ? '👑 Admin' : 'Użytkownik'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user._count.todos}</td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                            {user.createdAt.toLocaleDateString('pl-PL')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        </div>
    )
}
