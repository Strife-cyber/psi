import { useState } from "react"
import { motion } from "framer-motion"
import useAuthHook from "@/hooks/auth-hooks"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { CheckCircle2, Loader2 } from "lucide-react"
import PasswordStrengthIndicator from "@/components/password-strength-indicator"

interface RegisterFormProps {
  onSuccess?: () => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate();

  const { error, register, resetError } = useAuthHook()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    resetError()
    setIsLoading(true)

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      setIsLoading(false)
      return
    }

    const result = await register(name, email, password)

    setIsLoading(false)

    if (result === true) {
      setIsSuccess(true)
      onSuccess?.()

      // Optionally redirect after delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    // Simple password strength calculation
    let strength = 0
    if (newPassword.length > 0) strength += 20
    if (newPassword.length > 7) strength += 20
    if (/[A-Z]/.test(newPassword)) strength += 20
    if (/[0-9]/.test(newPassword)) strength += 20
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 20

    setPasswordStrength(strength)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 container-fluid">
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-6 text-center"
        >
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Registration Successful!</h3>
          <p className="text-muted-foreground">Redirecting you to login...</p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="remail"
              type="email"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="rpassword"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <PasswordStrengthIndicator strength={passwordStrength} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || passwordStrength < 60}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {error && (
            <p className="text-sm text-center text-red-500">
              {error || "An error occurred. Please try again."}
            </p>
          )}
        </>
      )}
    </form>
  )
}
