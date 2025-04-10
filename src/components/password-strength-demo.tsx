import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function PasswordStrengthDemo() {
  const [password, setPassword] = useState("")
  const [strength, setStrength] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setFeedback([])
      return
    }

    // Simple password strength evaluation
    let score = 0
    const newFeedback: string[] = []

    // Length check
    if (password.length >= 8) {
      score += 20
    } else {
      newFeedback.push("Password should be at least 8 characters long")
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 20
    } else {
      newFeedback.push("Add uppercase letters")
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 20
    } else {
      newFeedback.push("Add lowercase letters")
    }

    // Number check
    if (/\d/.test(password)) {
      score += 20
    } else {
      newFeedback.push("Add numbers")
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 20
    } else {
      newFeedback.push("Add special characters")
    }

    setStrength(score)
    setFeedback(newFeedback)
  }, [password])

  const getStrengthLabel = () => {
    if (strength === 0) return "Empty"
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

  const getStrengthIcon = () => {
    if (strength === 0) return null
    if (strength < 40) return <XCircle className="h-5 w-5 text-destructive" />
    if (strength < 80) return <AlertCircle className="h-5 w-5 text-amber-500" />
    return <CheckCircle className="h-5 w-5 text-emerald-500" />
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Password Strength Analyzer</CardTitle>
        <CardDescription>Enter a password to see how strong it is</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter a password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            className="text-lg"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStrengthIcon()}
              <span className="font-medium">{getStrengthLabel()}</span>
            </div>
            <span className="text-sm text-muted-foreground">{strength}%</span>
          </div>
          <Progress value={strength} className={getStrengthColor()} />
        </div>

        {feedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 rounded-lg bg-muted p-4"
          >
            <h4 className="font-medium">Suggestions:</h4>
            <ul className="space-y-1 text-sm">
              {feedback.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {strength >= 80 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-50"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="font-medium">Great password! This would be hard to crack.</span>
            </div>
          </motion.div>
        )}

        <Button className="w-full" disabled={!password || strength < 60}>
          Generate Similar Strong Password
        </Button>
      </CardContent>
    </Card>
  )
}
