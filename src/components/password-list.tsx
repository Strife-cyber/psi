import { useState } from "react"
import { Eye, EyeOff, Copy, Check, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Password } from ".."

interface PasswordListProps {
  passwords: Password[]
}

export default function PasswordList({ passwords }: PasswordListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const toggleVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.info("Password copied to clipboard");

    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-green-500 hover:bg-green-600"
      case "moderate":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "weak":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-slate-500"
    }
  }

  if (passwords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium mb-1">No passwords yet</h3>
        <p className="text-muted-foreground max-w-sm">
          No passwords in this category. Add some passwords or evaluate existing ones.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {passwords.map((password, index) => (
        <motion.div
          key={password.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group relative overflow-hidden bg-white dark:bg-slate-950 border rounded-lg hover:shadow-md transition-all duration-200"
        >
          <div
            className="absolute top-0 left-0 w-1 h-full transition-colors"
            style={{
              backgroundColor:
                password.strengthScore >= 0.8 ? "#22c55e" : password.strengthScore >= 0.5 ? "#eab308" : "#ef4444",
            }}
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 pl-6">
            <div className="flex-1 mr-4 mb-3 sm:mb-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-medium">{password.value}</h3>
                <Badge className={cn("text-white", getStrengthColor(password.strengthScore >= 0.8 ? "strong" : (
                    password.strengthScore < 0.5 ? "weak" : "moderate" 
                )))}>{password.strengthScore * 100}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono bg-slate-50 dark:bg-slate-900 p-1.5 rounded border">
                  {visiblePasswords[password.id] ? password.value : "••••••••••••"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleVisibility(password.id.toString())}
                title={visiblePasswords[password.id] ? "Hide password" : "Show password"}
                className="h-9 px-2.5"
              >
                {visiblePasswords[password.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="ml-2 hidden sm:inline">{visiblePasswords[password.id] ? "Hide" : "Show"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(password.value, password.id.toString())}
                title="Copy to clipboard"
                className="h-9 px-2.5"
              >
                {copiedId === password.id.toString() ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                <span className="ml-2 hidden sm:inline">{copiedId === password.id.toString() ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
