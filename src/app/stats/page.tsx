import { getStatistics } from '@/app/actions/export'
import Link from 'next/link'

export default async function StatisticsPage() {
    const stats = await getStatistics()

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            📊 Statystyki
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Przegląd Twoich zadań</p>
                    </div>
                    <Link href="/" className="px-4 py-2 text-sm font-medium rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        ← Powrót
                    </Link>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Razem" value={stats.total} icon="📋" color="indigo" />
                    <StatCard title="Ukończone" value={stats.completed} icon="✅" color="green" />
                    <StatCard title="Aktywne" value={stats.active} icon="🎯" color="blue" />
                    <StatCard title="Przeterminowane" value={stats.overdue} icon="⚠️" color="red" />
                </div>

                {/* Completion Rate */}
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 dark:border-gray-700/50">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Wskaźnik ukończenia</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                                style={{ width: `${stats.completionRate}%` }}
                            />
                        </div>
                        <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.completionRate}%</span>
                    </div>
                </div>

                {/* Time-based stats */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <TimeStatCard title="Dziś" value={stats.completedToday} />
                    <TimeStatCard title="Ten tydzień" value={stats.completedThisWeek} />
                    <TimeStatCard title="Ten miesiąc" value={stats.completedThisMonth} />
                </div>

                {/* Priority & Category Stats */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {/* By Priority */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Według priorytetu</h2>
                        <div className="space-y-3">
                            <PriorityBar label="Wysoki" value={stats.byPriority.high} total={stats.total} color="red" />
                            <PriorityBar label="Średni" value={stats.byPriority.medium} total={stats.total} color="yellow" />
                            <PriorityBar label="Niski" value={stats.byPriority.low} total={stats.total} color="green" />
                        </div>
                    </div>

                    {/* By Category */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Według kategorii</h2>
                        <div className="space-y-2">
                            {Object.entries(stats.byCategory).map(([name, count]) => (
                                <div key={name} className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">{name}</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
    const colorClasses: Record<string, string> = {
        indigo: 'from-indigo-500 to-purple-500',
        green: 'from-green-500 to-emerald-500',
        blue: 'from-blue-500 to-cyan-500',
        red: 'from-red-500 to-orange-500'
    }

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="text-2xl mb-2">{icon}</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
                {value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        </div>
    )
}

function TimeStatCard({ title, value }: { title: string; value: number }) {
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">ukończonych {title.toLowerCase()}</div>
        </div>
    )
}

function PriorityBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
    const percentage = total > 0 ? (value / total) * 100 : 0
    const colorClasses: Record<string, string> = {
        red: 'bg-red-500',
        yellow: 'bg-yellow-500',
        green: 'bg-green-500'
    }

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">{label}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${colorClasses[color]} transition-all`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}
