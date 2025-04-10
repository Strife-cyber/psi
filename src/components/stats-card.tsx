import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface StatsCardProps {
    title: string,
    value: string,
    delay: number,
    icon: ReactNode,
    description: string,
    variant?: "default" | "destructive" | "warning" | "success"
}

export default function StatsCard({
    title, value, description, icon,
    variant = "default", delay = 0
}: StatsCardProps) {
    const variantStyles = {
        default: "bg-primary/10 text-primary",
        destructive: "bg-destructive/10 text-destructive",
        warning: "bg-amber-500/10 text-amber-500",
        success: "bg-emerald-500/10 text-emerald-500",
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <div className={`rounded-full p-2 ${variantStyles[variant]}`}>{icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground pt-1">{description}</p>
            </CardContent>
          </Card>
        </motion.div>
    );
}
