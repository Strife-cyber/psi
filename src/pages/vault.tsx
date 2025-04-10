import { Shield, Lock } from "lucide-react";
import PasswordVault from "@/components/password-vault";
import { BreadcrumbItem } from "..";
import AppLayout from "@/layouts/app-layout";

export default function Vault() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Vault",
            href: "/vault"
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                        <div className="container mx-auto py-8 px-4">
                            <header className="text-center mb-12 pt-8">
                            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                SecureVault
                            </h1>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Safely store, manage, and evaluate your passwords in one secure location.
                            </p>
                            </header>

                            <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="p-6 sm:p-8">
                                <PasswordVault />
                            </div>
                            </div>

                            <footer className="mt-16 text-center text-sm text-muted-foreground">
                            <p>Your passwords are stored locally and never leave your device.</p>
                            <div className="flex items-center justify-center mt-2 gap-1">
                                <Lock className="h-3 w-3" />
                                <span>End-to-end encryption</span>
                            </div>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
