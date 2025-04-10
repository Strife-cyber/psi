import { Quote } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  delay?: number
}

export default function TestimonialCard({ quote, author, role, delay = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="h-full transition-all duration-200 hover:shadow-lg">
        <CardContent className="pt-6">
          <Quote className="h-8 w-8 text-primary/40" />
          <p className="mt-4 text-lg">{quote}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
