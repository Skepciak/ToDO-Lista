'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { acceptInvite } from '@/app/actions/board'

export function AcceptInviteButton({ token }: { token: string }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function handleAccept() {
        startTransition(async () => {
            const result = await acceptInvite(token)
            if (result.success && result.boardId) {
                router.push(`/boards/${result.boardId}`)
                router.refresh()
            }
        })
    }

    return (
        <button onClick={handleAccept} disabled={isPending} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 text-sm whitespace-nowrap">
            {isPending ? 'Dołączanie...' : '✓ Dołącz'}
        </button>
    )
}
