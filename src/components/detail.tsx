import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EyeOff, Eye, Copy, ExternalLink } from "lucide-react"

interface DetailProps {
    label: string
    value: string | number | boolean
    copyable?: boolean
    badge?: boolean
    show?: boolean
    setShow?: React.Dispatch<React.SetStateAction<boolean>> | null
    link?: boolean
}

export default function Detail({
    label,
    value,
    copyable = false,
    badge = false,
    show = true,
    setShow = null,
    link = false,
}: DetailProps) {
    const displayValue = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)

    return (
        <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <div className="flex items-center justify-between">
            {badge ? (
            <Badge variant="outline">{displayValue}</Badge>
            ) : (
            <p className="text-sm">{show ? displayValue : "••••••••••••••"}</p>
            )}
            <div className="flex gap-1">
            {setShow && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShow(!show)}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            )}
            {copyable && (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
                </Button>
            )}
            {link && (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
                </Button>
            )}
            </div>
        </div>
        </div>
    );
}
