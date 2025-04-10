import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, LockKeyhole, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Detail {
  icon: "encryption" | "reuse" | "weak";
  title: string;
  description: string;
}

interface SecurityScoreProps {
  score: number;
  label?: string;
  showDetails?: boolean;
  details?: Detail[];
  className?: string;
}

const iconMap = {
  encryption: <LockKeyhole className="h-4 w-4 text-emerald-500" />,
  reuse: <AlertCircle className="h-4 w-4 text-amber-500" />,
  weak: <ShieldAlert className="h-4 w-4 text-destructive" />,
};

export default function SecurityScore({
  score,
  label = "Password Strength",
  showDetails = false,
  details = [],
  className = "",
}: SecurityScoreProps) {
  const scoreColor = score > 80 ? "bg-emerald-500" : score > 60 ? "bg-amber-500" : "bg-destructive";

  const scoreText = score > 80 ? "Strong" : score > 60 ? "Moderate" : "Weak";

  const scoreIcon =
    score > 80 ? (
      <CheckCircle className="h-5 w-5 text-emerald-500" />
    ) : score > 60 ? (
      <AlertCircle className="h-5 w-5 text-amber-500" />
    ) : (
      <ShieldAlert className="h-5 w-5 text-destructive" />
    );

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{label}</CardTitle>
        <CardDescription>Overall security assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {scoreIcon}
              <span className="font-semibold">{scoreText}</span>
            </div>
            <span className="text-sm font-medium">{score}%</span>
          </div>

          <Progress value={score} className={scoreColor} />

          {showDetails && details.length > 0 && (
            <div className="mt-4 space-y-3">
              {details.map((detail, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 rounded-md border p-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  {iconMap[detail.icon]}
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{detail.title}</p>
                    <p className="text-xs text-muted-foreground">{detail.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
