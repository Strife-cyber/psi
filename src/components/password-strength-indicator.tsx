import { motion } from "framer-motion"

interface PasswordStrengthIndicatorProps {
  strength: number
}

export default function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  const getStrengthLabel = () => {
    if (strength === 0) return ""
    if (strength < 40) return "Weak"
    if (strength < 80) return "Medium"
    return "Strong"
  }

  const getStrengthColor = () => {
    if (strength === 0) return "bg-muted"
    if (strength < 40) return "bg-destructive"
    if (strength < 80) return "bg-amber-500"
    return "bg-emerald-500"
  }

  if (strength === 0) return null

  return (
    <div className="mt-1 space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">{getStrengthLabel()}</p>
        <p className="text-xs text-muted-foreground">{strength}%</p>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${getStrengthColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {strength < 60 && (
        <p className="text-xs text-muted-foreground">
          Password should be at least 8 characters with uppercase, lowercase, numbers, and special characters.
        </p>
      )}
    </div>
  )
}
