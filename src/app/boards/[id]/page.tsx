import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getBoard } from '@/app/actions/board'
import { BoardTodoForm } from '@/components/BoardTodoForm'
import { InviteMemberForm } from '@/components/InviteMemberForm'
import { TodoItem } from '@/components/TodoItem'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function BoardPage({ params }: PageProps) {
    const session = await auth()
    const { id } = await params

    if (!session?.user) {
        redirect(`/login?callbackUrl=/boards/${id}`)
    }

    const board = await getBoard(id)

    if (!board) {
        notFound()
    }

    const isOwner = board.ownerId === session.user.id
    const isAdmin = board.members.some(m => m.userId === session.user.id && ['owner', 'admin'].includes(m.role))

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                            style={{ backgroundColor: board.color }}
                        >
                            {board.name[0].toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{board.name}</h1>
                            {board.description && (
                                <p className="text-gray-500 dark:text-gray-400">{board.description}</p>
                            )}
                        </div>
                    </div>
                    <Link href="/boards" className="px-4 py-2 text-sm font-medium rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        ← Wróć do tablic
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Add todo */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Dodaj zadanie</h2>
                            <BoardTodoForm boardId={board.id} />
                        </div>

                        {/* Todos list */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Zadania ({board.todos.length})
                            </h2>

                            {board.todos.length > 0 ? (
                                <div className="space-y-3">
                                    {board.todos.map((todo) => (
                                        <TodoItem
                                            key={todo.id}
                                            id={todo.id}
                                            title={todo.title}
                                            description={todo.description}
                                            completed={todo.completed}
                                            priority={todo.priority}
                                            dueDate={todo.dueDate}
                                            category={todo.category}
                                            categoryId={todo.categoryId}
                                            subtasks={todo.subtasks}
                                            categories={[]}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 text-center py-8">
                                    Brak zadań. Dodaj pierwsze zadanie powyżej!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Members */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                👥 Członkowie ({board.members.length})
                            </h3>
                            <div className="space-y-3">
                                {board.members.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                                            {member.user.name?.[0] || member.user.email[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                {member.user.name || member.user.email}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                {member.role === 'owner' ? '👑 Właściciel' : member.role}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Invite (only for owner/admin) */}
                        {isAdmin && (
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                    ✉️ Zaproś
                                </h3>
                                <InviteMemberForm boardId={board.id} />

                                {board.invites.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Oczekujące zaproszenia:</p>
                                        {board.invites.map((invite) => (
                                            <div key={invite.id} className="text-sm text-gray-600 dark:text-gray-400">
                                                {invite.email}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
