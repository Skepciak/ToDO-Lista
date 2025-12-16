interface CategoryBadgeProps {
    name: string
    color: string
}

export function CategoryBadge({ name, color }: CategoryBadgeProps) {
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-white/80 border"
            style={{ borderColor: color, color: color }}
        >
            <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
            />
            {name}
        </span>
    )
}
