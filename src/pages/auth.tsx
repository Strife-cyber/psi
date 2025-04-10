
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Shield } from "lucide-react"
import LoginForm from "@/components/login-form"
import RegisterForm from "@/components/register-form"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("register")

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <div className="container-fluid flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="inline-block text-xl font-bold">PSI</span>
            </Link>
          </div>

          <Card className="overflow-hidden border-2 p-0">
            <Tabs
              value={activeTab}
              onValueChange={(value: string) => setActiveTab(value as "login" | "register")}
              className="w-full"
            >
              <div className="border-b px-6 py-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="register" className="text-base">
                    Register
                  </TabsTrigger>
                  <TabsTrigger value="login" className="text-base">
                    Login
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <div className="relative min-h-[520px]">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{
                          x: activeTab === "register" ? -300 : 300,
                          opacity: 0,
                        }}
                        animate={{
                          x: 0,
                          opacity: 1,
                        }}
                        exit={{
                          x: activeTab === "register" ? 300 : -300,
                          opacity: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="absolute inset-0 w-full"
                      >
                        <TabsContent
                          value="register"
                          forceMount
                          className={activeTab === "register" ? "block" : "hidden"}
                        >
                          <div className="p-6">
                            <div className="mb-8 text-center">
                              <h1 className="text-2xl font-bold">Create an Account</h1>
                              <p className="text-sm text-muted-foreground">
                                Sign up to start managing your passwords securely
                              </p>
                            </div>
                            <RegisterForm />
                          </div>
                        </TabsContent>

                        <TabsContent value="login" forceMount className={activeTab === "login" ? "block" : "hidden"}>
                          <div className="p-6">
                            <div className="mb-12 text-center">
                              <h1 className="text-2xl font-bold">Welcome Back</h1>
                              <p className="text-sm text-muted-foreground">Log in to access your secure passwords</p>
                            </div>
                            <LoginForm />
                          </div>
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Tabs>
          </Card>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

