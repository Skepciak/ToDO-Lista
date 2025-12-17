import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getBoards } from '@/app/actions/board'
import { CreateBoardForm } from '@/components/CreateBoardForm'

export default async function BoardsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/login?callbackUrl=/boards')
    }

    const boards = await getBoards()

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            📋 Moje Tablice
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Zarządzaj tablicami i współpracuj z innymi</p>
                    </div>
                    <Link href="/" className="px-4 py-2 text-sm font-medium rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        ← Powrót
                    </Link>
                </div>

                {/* Create new board */}
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20 dark:border-gray-700/50">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Utwórz nową tablicę</h2>
                    <CreateBoardForm />
                </div>

                {/* Boards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boards.map((board) => (
                        <Link
                            key={board.id}
                            href={`/boards/${board.id}`}
                            className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                                    style={{ backgroundColor: board.color }}
                                >
                                    {board.name[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                                        {board.name}
                                    </h3>
                                    {board.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{board.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>{board._count.todos} zadań</span>
                                <span>{board.members.length} członków</span>
                            </div>
                        </Link>
                    ))}

                    {boards.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                <span className="text-4xl">📋</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Brak tablic</h3>
                            <p className="text-gray-400 dark:text-gray-500">Utwórz pierwszą tablicę powyżej!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
