import { Progress } from "./ui/progress"

interface StrengthCategoryProps {
    label: string
    count: number
    total: number
    color: string
}

export default function StrengthCategory({ label, count, total, color }: StrengthCategoryProps) {
    const percentage = Math.round((count / total) * 100)

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${color}`} />
                <span>{label}</span>
                </div>
                <div className="text-muted-foreground">
                <span className="font-medium">{count}</span>
                <span>
                    {" "}
                    / {total} ({percentage}%)
                </span>
                </div>
            </div>
            <Progress value={percentage} className={color} />
        </div>
    )
}
