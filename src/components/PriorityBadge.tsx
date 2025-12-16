import { Priority } from '@/app/actions/todo'

interface PriorityBadgeProps {
    priority: Priority
    size?: 'sm' | 'md'
}

const priorityConfig = {
    high: {
        label: 'Wysoki',
        bgClass: 'bg-red-100 text-red-700 border-red-200',
        dotClass: 'bg-red-500'
    },
    medium: {
        label: 'Średni',
        bgClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        dotClass: 'bg-yellow-500'
    },
    low: {
        label: 'Niski',
        bgClass: 'bg-green-100 text-green-700 border-green-200',
        dotClass: 'bg-green-500'
    }
}

export function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
    const config = priorityConfig[priority]
    const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bgClass} ${sizeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
            {config.label}
        </span>
    )
}
