import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Eye, EyeOff, RefreshCw } from "lucide-react"

export default function HeroAnimation() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [strength, setStrength] = useState(0)

  // Simulate password generation
  const generatePassword = () => {
    setIsGenerating(true)
    setPassword("")
    setStrength(0)

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+"
    let tempPassword = ""

    // Animate password generation
    let i = 0
    const interval = setInterval(() => {
      if (i < 16) {
        tempPassword += chars.charAt(Math.floor(Math.random() * chars.length))
        setPassword(tempPassword)
        setStrength(Math.min(100, (i / 16) * 100))
        i++
      } else {
        clearInterval(interval)
        setIsGenerating(false)
      }
    }, 100)
  }

  // Generate password on initial load
  useEffect(() => {
    generatePassword()
  }, [])

  return (
    <Card className="overflow-hidden border-2 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Password Generator</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={generatePassword} disabled={isGenerating}>
              <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              readOnly
              className="pr-10 font-mono text-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Password Strength</span>
              <span>{strength < 30 ? "Weak" : strength < 70 ? "Medium" : "Strong"}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <motion.div
                className={`h-full rounded-full ${
                  strength < 30 ? "bg-destructive" : strength < 70 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                initial={{ width: "0%" }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {["A-Z", "a-z", "0-9", "#$&"].map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: strength > index * 25 ? 1 : 0.5,
                  scale: strength > index * 25 ? 1 : 0.8,
                }}
                className={`flex items-center justify-center rounded-md border p-2 text-xs font-medium ${
                  strength > index * 25
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted bg-muted/50 text-muted-foreground"
                }`}
              >
                {type}
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button className="w-full" onClick={generatePassword} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate New Password"}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
