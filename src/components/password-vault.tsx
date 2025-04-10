import { toast } from "sonner"
import type { Password } from ".."
import { motion } from "framer-motion"
import PasswordList from "./password-list"
import useEntryHook from "@/hooks/entry-hooks"
import { Button } from "@/components/ui/button"
import usePasswordHook from "@/hooks/password-hook"
import { useState, useEffect, useCallback } from "react"
import { exportPasswordsToCSV } from "@/utils/csv-export"
import PasswordEvaluator from "@/components/password-evaluator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ShieldCheck, ShieldAlert, ShieldQuestion, Gauge } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PasswordVault() {
    const { getEntries } = useEntryHook()
  const { getAllPasswords } = usePasswordHook()
  
  const [passwords, setPasswords] = useState<Password[]>([])
  const [activeTab, setActiveTab] = useState("vault")

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const [passwordData] = await Promise.all([
        getAllPasswords()
      ])
      setPasswords(passwordData || [])
    } catch (error) {
      toast.error("Failed to load vault data")
      console.error("Vault data fetch error:", error)
    }
  }, [getAllPasswords, getEntries])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleExport = useCallback(() => {
    if (passwords.length === 0) {
      toast.error("No passwords to export", {
        description: "Add some passwords to your vault first",
      })
      return
    }

    exportPasswordsToCSV(passwords)
    toast.success("Export successful", {
      description: "Your passwords have been exported to CSV",
    })
  }, [passwords])

  // Filter passwords by strength
  const strongPasswords = passwords.filter(p => p.strengthScore >= 0.8)
  const moderatePasswords = passwords.filter(p => p.strengthScore > 0.4 && p.strengthScore < 0.8)
  const weakPasswords = passwords.filter(p => p.strengthScore <= 0.4)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Password Vault</h2>
          <p className="text-muted-foreground">Securely manage your credentials</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download size={16} />
          Export as CSV
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="vault" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Vault</span>
          </TabsTrigger>
          <TabsTrigger value="strong" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Strong</span>
          </TabsTrigger>
          <TabsTrigger value="moderate" className="flex items-center gap-2">
            <ShieldQuestion className="h-4 w-4" />
            <span>Moderate</span>
          </TabsTrigger>
          <TabsTrigger value="weak" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span>Weak</span>
          </TabsTrigger>
          <TabsTrigger value="evaluate" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span>Evaluate</span>
          </TabsTrigger>
        </TabsList>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <TabsContent value="vault">
            <Card className="border-green-200 dark:border-green-900" style={{ padding: 0 }}>
              <CardHeader className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-900">
                <div className="flex items-center gap-2 mt-6">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <CardTitle>Strong Passwords</CardTitle>
                </div>
                <CardDescription>These passwords provide excellent security with high complexity.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <PasswordList passwords={strongPasswords} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strong">
            <Card className="border-green-200 p-0 dark:border-green-900">
              <CardHeader className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-900">
                <div className="flex items-center gap-2 mt-6">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <CardTitle>Strong Passwords ({strongPasswords.length})</CardTitle>
                </div>
                <CardDescription>These passwords provide excellent security ({"Score > 70%"})</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <PasswordList passwords={strongPasswords}/>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderate">
            <Card className="border-yellow-200 p-0 dark:border-yellow-900">
              <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30 border-b border-yellow-100 dark:border-yellow-900">
                <div className="flex items-center mt-6 gap-2">
                  <ShieldQuestion className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Moderate Passwords</CardTitle>
                </div>
                <CardDescription>These passwords provide adequate security but could be improved.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <PasswordList passwords={moderatePasswords} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weak">
          <Card className="border-red-200 p-0 dark:border-red-900">
              <CardHeader className="bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900">
                <div className="flex items-center mt-6 gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  <CardTitle>Weak Passwords</CardTitle>
                </div>
                <CardDescription>
                  These passwords are vulnerable and should be updated as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <PasswordList passwords={weakPasswords} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluate">
            <Card className="p-0">
              <CardHeader className="bg-slate-50 dark:bg-slate-950/50 border-b">
                <div className="flex items-center mt-6 gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <CardTitle>Evaluate Password</CardTitle>
                </div>
                <CardDescription>Check the strength of your password and save it to your vault.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <PasswordEvaluator />
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  )
}