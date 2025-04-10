import { toast } from "sonner";
import { useState, useCallback } from "react";
import useEntryHook from "@/hooks/entry-hooks";
import usePasswordHook from "@/hooks/password-hook";
import { CheckCircle, AlertCircle, XCircle, Eye, EyeOff, RefreshCw, Save } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Progress } from "./ui/progress"; // Changed from @radix-ui/react-progress
import { cn } from "@/lib/utils";

export default function PasswordEvaluator() {
    const { createEntry } = useEntryHook();
    const { evaluate, register } = usePasswordHook();

    const [password, setPassword] = useState("");
    const [passwordTitle, setPasswordTitle] = useState("");
    const [passDescription, setPassDescription] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [evaluation, setEvaluation] = useState<{
        rarity: number;
        password: string;
        strength: number;
        isUnique: boolean;
    } | null>(null);

    // Generate a random strong password
    const generatePassword = useCallback(() => {
        const length = 16;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let newPassword = "";
        for (let i = 0; i < length; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(newPassword);
        setEvaluation(null);
    }, []);

    const evaluatePassword = useCallback(async () => {
        if (!password) {
            toast.error("Please enter a password to evaluate");
            return;
        }
        try {
            const data = await evaluate(password);
            if (data) {
                setEvaluation(data);
                toast.success("Evaluation complete");
            } else {
                throw new Error("Evaluation failed");
            }
        } catch (error) {
            toast.error("Could not evaluate password");
            console.error("Password evaluation error:", error);
        }
    }, [password, evaluate]);

    const savePassword = useCallback(async () => {
        if (!password || !passwordTitle) {
            toast.error("Password and title are required");
            return;
        }
        try {
            const registeredData = await register(password);
            if (!registeredData?.password?.id) {
                throw new Error("Registration failed");
            }

            await createEntry({
                title: passwordTitle,
                description: passDescription || "No description provided",
                passwordId: registeredData.password.id
            });

            toast.success("New password registered");
            setPassword("");
            setPasswordTitle("");
            setPassDescription("");
            setEvaluation(null);
        } catch (error) {
            toast.error("An error occurred while registering password");
            console.error("Password save error:", error);
        }
    }, [password, passwordTitle, passDescription, register, createEntry]);

    const getScoreColor = useCallback((score: number) => {
        if (score >= 70) return "bg-green-500";
        if (score >= 40) return "bg-yellow-500";
        return "bg-red-500";
    }, []);

    const getStrengthIcon = useCallback((strength: number) => {
        if (strength > 0.7) return <CheckCircle className="h-5 w-5 text-green-500" />;
        if (strength > 0.4) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        return <XCircle className="h-5 w-5 text-red-500" />;
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="password-name">Password Name</Label>
                    <Input
                        id="password-name"
                        placeholder="e.g., Gmail, Netflix, Bank Account"
                        value={passwordTitle}
                        onChange={(e) => setPasswordTitle(e.target.value)}
                        className="bg-white dark:bg-slate-950"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password-value">Password</Label>
                    <div className="relative">
                        <Input
                            id="password-value"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password to evaluate"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setEvaluation(null);
                            }}
                            className="pr-20 bg-white dark:bg-slate-950"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="absolute right-10 top-0 h-full"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="absolute right-0 top-0 h-full"
                            onClick={generatePassword}
                            title="Generate strong password"
                        >
                            <RefreshCw size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password-description">Description (Optional)</Label>
                <Input
                    id="password-description"
                    placeholder="Add a description"
                    value={passDescription}
                    onChange={(e) => setPassDescription(e.target.value)}
                    className="bg-white dark:bg-slate-950"
                />
            </div>

            <div className="flex gap-3">
                <Button 
                    onClick={evaluatePassword} 
                    className="flex-1" 
                    variant="outline"
                    disabled={!password}
                >
                    Evaluate
                </Button>
                <Button 
                    onClick={savePassword} 
                    className="flex-1 flex gap-2" 
                    disabled={!evaluation || !passwordTitle}
                >
                    <Save size={18} />
                    Save to Vault
                </Button>
            </div>

            {evaluation && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-4 p-6 border rounded-lg bg-slate-50 dark:bg-slate-900"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {getStrengthIcon(evaluation.strength)}
                                <span className="font-medium capitalize">
                                    {evaluation.strength > 0.7 ? "Strong" : 
                                     evaluation.strength > 0.4 ? "Moderate" : "Weak"} Password
                                </span>
                            </div>
                            <span className="text-sm font-medium">
                                {Math.round(evaluation.strength * 100)}%
                            </span>
                        </div>
                        <Progress 
                            value={evaluation.strength * 100} 
                            className={cn("h-2 w-full", getScoreColor(evaluation.strength * 100))}
                        />
                        <div className="space-y-2 text-sm">
                            <p>Rarity Score: {evaluation.rarity}/100</p>
                            <p>Unique: {evaluation.isUnique ? "Yes" : "No"}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
