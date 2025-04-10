import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/stats-card';
import usePasswordHook from '@/hooks/password-hook';
import { Password, type BreadcrumbItem } from '@/index';
import SecurityScore from '@/components/security-score';
import { 
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card"
import { 
    Activity, AlertCircle, EyeOff, 
    Key, LockKeyhole, Shield, ShieldCheck 
} from "lucide-react";
import StrengthCategory from '@/components/strength-category';

interface Stats {
    weak: number;
    total: number;
    reused: number;
    health: number;
}

export default function Dashboard() {
    const { getAllPasswords } = usePasswordHook();
    const [stats, setStats] = useState<Stats>({ weak: 0, total: 0, reused: 0, health: 0 });
    const [allPasswords, setAllPasswords] = useState<Password[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Dashboard",
            href: '/dashboard',
        },
    ];

    useEffect(() => {
        const fetchPasswords = async () => {
            const passwords = await getAllPasswords();
            if (passwords) {
                setAllPasswords(passwords);
            }
        };

        fetchPasswords();
    }, []);

    useEffect(() => {
        const computeStats = () => {
            if (allPasswords.length === 0) return;

            let weak = 0;
            let reused = 0;
            const total = allPasswords.length;
            let totalScore = 0;

            // Count how many passwords are reused
            const seen: Record<string, number> = {};

            allPasswords.forEach((password) => {
                if (password.strengthScore < 0.6) {
                    weak += 1;
                }

                const content = password.value;
                if (seen[content]) {
                    seen[content] += 1;
                    reused += 1;
                } else {
                    seen[content] = 1;
                }

                totalScore += password.strengthScore;
            });

            const health = Math.round((totalScore / total) * 100);

            setStats({
                weak,
                reused,
                total,
                health,
            });
        };

        computeStats();
    }, [allPasswords]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className='space-y-8 p-2'>
                        <div className='flex flex-col gap-2 p-2'>
                            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
                            <p className='text-muted-foreground'>
                                Welcome back! Here's an overview of your password security
                            </p>
                        </div>

                        {/* Stats cards */}
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                            <StatsCard
                                title="Total Passwords"
                                value={stats.total.toString()}
                                description="Stored securely in your vault"
                                icon={<Key className="h-4 w-4" />}
                                delay={0}
                            />
                            <StatsCard
                                title="Weak Passwords"
                                value={stats.weak.toString()}
                                description="Passwords that need attention"
                                icon={<AlertCircle className="h-4 w-4" />}
                                variant="destructive"
                                delay={0.1}
                            />
                            <StatsCard
                                title="Reused Passwords"
                                value={stats.reused.toString()}
                                description="Used across multiple sites"
                                icon={<EyeOff className="h-4 w-4" />}
                                variant="warning"
                                delay={0.2}
                            />
                            <StatsCard
                                title="Password Health"
                                value={`${stats.health}%`}
                                description="Overall security score"
                                icon={<ShieldCheck className="h-4 w-4" />}
                                variant="success"
                                delay={0.3}
                            />
                        </div>

                        {/* Main Content */}
                        <div className='grid gap-4 md:grid-cols-7'>
                            <div className='md:col-span-3'>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                    <SecurityScore score={stats.health} showDetails={true} />
                                </motion.div>
                            </div>
                        </div>

                        {/* Strength Distribution */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-medium">Password Strength Distribution</CardTitle>
                                    <CardDescription>Overview of your password strength categories</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <StrengthCategory label="Strong" count={stats.total - stats.weak} total={stats.total} color="bg-emerald-500" />
                                        <StrengthCategory label="Moderate" count={0} total={stats.total} color="bg-amber-500" />
                                        <StrengthCategory label="Weak" count={stats.weak} total={stats.total} color="bg-destructive" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" size="sm" className="w-full">
                                        Improve Password Strength
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                                    <CardDescription>Common tasks you can perform</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                    <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 justify-start">
                                        <div className="flex w-full items-center gap-2">
                                        <Shield className="h-4 w-4 text-primary" />
                                        <span className="font-medium">New Password</span>
                                        </div>
                                        <p className="text-xs text-wrap text-muted-foreground text-left">Create and store a new password</p>
                                    </Button>
                                    <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 justify-start">
                                        <div className="flex w-full items-center gap-2">
                                        <LockKeyhole className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Password Check</span>
                                        </div>
                                        <p className="text-xs text-wrap text-muted-foreground text-left">Check if your passwords are compromised</p>
                                    </Button>
                                    <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 justify-start">
                                        <div className="flex w-full items-center gap-2">
                                        <Key className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Import</span>
                                        </div>
                                        <p className="text-xs text-wrap text-muted-foreground text-left">Import passwords from another manager</p>
                                    </Button>
                                    <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 justify-start">
                                        <div className="flex w-full items-center gap-2">
                                        <Activity className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Security Audit</span>
                                        </div>
                                        <p className="text-xs text-wrap text-muted-foreground text-left">Run a full security audit on your vault</p>
                                    </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
