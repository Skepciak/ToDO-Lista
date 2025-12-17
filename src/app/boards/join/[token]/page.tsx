import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { acceptInvite } from '@/app/actions/board'

interface PageProps {
    params: Promise<{ token: string }>
}

export default async function JoinBoardPage({ params }: PageProps) {
    const session = await auth()
    const { token } = await params

    if (!session?.user) {
        redirect(`/login?callbackUrl=/boards/join/${token}`)
    }

    const result = await acceptInvite(token)

    if (result.error) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="text-4xl">❌</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Błąd zaproszenia</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{result.error}</p>
                    <Link href="/boards" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all">
                        Przejdź do tablic
                    </Link>
                </div>
            </main>
        )
    }

    redirect(`/boards/${result.boardId}`)
}
