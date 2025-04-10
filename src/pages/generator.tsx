"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Copy, RefreshCw, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SecurityScore from "@/components/security-score"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner" // Using sonner directly

import usePasswordHook from "@/hooks/password-hook"
import type { BreadcrumbItem } from "@/index"
import AppLayout from "@/layouts/app-layout"
import useEntryHook from "@/hooks/entry-hooks"

export default function PasswordGeneratorPage() {
    const { generate, register, evaluate } = usePasswordHook()
    const { createEntry } = useEntryHook();

    const [password, setPassword] = useState("")
    const [length, setLength] = useState(16)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [rarityScore, setRarityScore] = useState(0)
    const [isUnique, setIsUnique] = useState(true)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const [saveDialogOpen, setSaveDialogOpen] = useState(false)
    const [entryTitle, setEntryTitle] = useState("")
    const [entryDescription, setEntryDescription] = useState("")
    const [generationType, setGenerationType] = useState<"api" | "pin">("api")
    const [pinLength, setPinLength] = useState(6)
    const [, setError] = useState<string | null>(null)

    useEffect(() => {
        generatePassword()
    }, []);

    const generatePassword = async () => {
        setLoading(true)
        setError(null)

        try {
            if (generationType === "api") {
                const result = await generate(length);
                const evaluation = await evaluate(result);
                if (result) {
                    setPassword(result)
                    setPasswordStrength((evaluation.strength * 100))
                    setRarityScore(evaluation.rarity * 100)
                    setIsUnique(evaluation.isUnique)
                } else {
                    setError("Failed to generate password. Please try again.")
                    toast.error("Generation Failed", {
                        description: "Could not generate password. Please try again.",
                    })
                }
            } else {
                let pin = ""
                for (let i = 0; i < pinLength; i++) {
                    pin += Math.floor(Math.random() * 10).toString()
                }
                setPassword(pin)
                setPasswordStrength(Math.min(50, pinLength * 8))
                setRarityScore(Math.min(30, pinLength * 5))
                setIsUnique(false)
            }
        } catch (err) {
        setError("An error occurred while generating the password.")
        toast.error("Error", {
            description: "An error occurred while generating the password.",
        })
        console.error(err)
        } finally {
        setLoading(false)
        }
    }

    const copyToClipboard = async () => {
        try {
        await navigator.clipboard.writeText(password)
        setCopied(true)
        toast.success("Copied!", {
            description: "Password has been copied to your clipboard.",
        })
        setTimeout(() => setCopied(false), 2000)
        } catch (err) {
        console.error("Failed to copy:", err)
        toast.error("Copy Failed", {
            description: "Could not copy password to clipboard.",
        })
        }
    }

    const handleSavePassword = async () => {
        if (!entryTitle) {
            toast.error("Title Required", {
                description: "Please provide a title for this entry.",
            })
            return
        }

        setLoading(true)
        try {
            const saved = await register(password!)
            await createEntry({ title: entryTitle, description: entryDescription, passwordId: saved?.password?.id })

            if (saved) {
                toast.success("Password Saved", {
                    description: "Your password has been saved successfully.",
                });
                setSaveDialogOpen(false)
                setEntryTitle("")
                setEntryDescription("")
            } else {
                toast.error("Save Failed", {
                description: "Could not save your password. Please try again.",
                })
            }
            } catch (err) {
            console.error("Failed to save password:", err)
            toast.error("Error", {
                description: "An error occurred while saving the password.",
            })
        } finally {
            setLoading(false)
        }
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Generator",
            href: '/generator',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="space-y-6">
                    <div className="flex flex-col gap-2 p-4">
                        <h1 className="text-2xl font-bold tracking-tight">Password Generator</h1>
                        <p className="text-muted-foreground">Create strong, secure passwords that are difficult to crack.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 p-4">
                        {/* Generator Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Card className="h-full">
                            <CardHeader>
                            <CardTitle>Generate a Password</CardTitle>
                            <CardDescription>Customize your password generation settings</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <Tabs value={generationType} onValueChange={(value) => setGenerationType(value as "api" | "pin")}>
                                <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="api">Secure Password</TabsTrigger>
                                <TabsTrigger value="pin">PIN</TabsTrigger>
                                </TabsList>

                                <TabsContent value="api" className="mt-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                    <Label htmlFor="length">Password Length: {length}</Label>
                                    </div>
                                    <Slider
                                    id="length"
                                    min={8}
                                    max={32}
                                    step={1}
                                    value={[length]}
                                    onValueChange={(value) => setLength(value[0])}
                                    />
                                </div>
                                </TabsContent>

                                <TabsContent value="pin" className="mt-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                    <Label htmlFor="pinLength">PIN Length: {pinLength}</Label>
                                    </div>
                                    <Slider
                                    id="pinLength"
                                    min={4}
                                    max={12}
                                    step={1}
                                    value={[pinLength]}
                                    onValueChange={(value) => setPinLength(value[0])}
                                    />
                                </div>
                                </TabsContent>
                            </Tabs>
                            </CardContent>
                            <CardFooter>
                            <Button onClick={generatePassword} className="w-full" disabled={loading}>
                                {loading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                                ) : (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Generate New Password
                                </>
                                )}
                            </Button>
                            </CardFooter>
                        </Card>
                        </motion.div>

                        {/* Result Card */}
                        <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        >
                        <Card className="h-full">
                            <CardHeader>
                            <CardTitle>Your Generated Password</CardTitle>
                            <CardDescription>Copy this password and store it securely</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="flex">
                                <Input id="password" value={password} readOnly className="flex-1 font-mono text-base pr-10" />
                                <Button variant="ghost" size="icon" className="ml-[-40px] h-10 w-10" onClick={copyToClipboard}>
                                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                </div>
                            </div>

                            <SecurityScore score={passwordStrength} />

                            <div className="rounded-md bg-muted p-4">
                                <h3 className="mb-2 text-sm font-medium">Password Analysis</h3>
                                <ul className="space-y-1 text-sm">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    {generationType === "api" ? `${length} characters long` : `${pinLength} digits long`}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    Rarity Score: {rarityScore}/100
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    {isUnique ? "Unique password" : "Common pattern detected"}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    {passwordStrength > 80
                                    ? "Extremely difficult to crack"
                                    : passwordStrength > 60
                                    ? "Reasonably secure password"
                                    : "Basic level of security"}
                                </li>
                                </ul>
                            </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between">
                            <Button variant="outline" onClick={copyToClipboard}>
                                {copied ? "Copied!" : "Copy to Clipboard"}
                            </Button>

                            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                                <DialogTrigger asChild>
                                <Button>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Password
                                </Button>
                                </DialogTrigger>
                                <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Save Password</DialogTitle>
                                    <DialogDescription>Create a new entry to store this password securely.</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Gmail Account"
                                        value={entryTitle}
                                        onChange={(e) => setEntryTitle(e.target.value)}
                                    />
                                    </div>
                                    <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Input
                                        id="description"
                                        placeholder="e.g., Work email account"
                                        value={entryDescription}
                                        onChange={(e) => setEntryDescription(e.target.value)}
                                    />
                                    </div>
                                    <div className="space-y-2">
                                    <Label>Password</Label>
                                    <div className="rounded-md bg-muted p-2 font-mono">{password}</div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                                    Cancel
                                    </Button>
                                    <Button onClick={handleSavePassword} disabled={loading || !entryTitle}>
                                    {loading ? (
                                        <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                        </>
                                    ) : (
                                        "Save Entry"
                                    )}
                                    </Button>
                                </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
        </div>    
    </AppLayout>
    )
}