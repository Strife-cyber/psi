import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import useAuthHook from "@/hooks/auth-hooks"
import { Button } from "@/components/ui/button"
import FeatureCard from "@/components/feature-card"
import HeroAnimation from "@/components/hero-animation"
import TestimonialCard from "@/components/testimonial-card"
import { ArrowRight, Lock, Shield, Star } from "lucide-react"
import PasswordStrengthDemo from "@/components/password-strength-demo"

export default function Home() {
  const { isLoggedIn } = useAuthHook();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="container-fluid z-40 bg-background">
        <div className="flex h-20 items-center justify-between px-4 py-6">
          <div className="flex gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold inline-block text-xl">PSI</span>
            </Link>
          </div>
          {
            isLoggedIn() ? (
              <Link to="/dashboard"><Button>Dashboard</Button></Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/auth">
                  <Button variant="outline" className="hidden md:flex">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth"><Button>Get Started</Button></Link>
              </div>
            )
          }
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container-fluid flex flex-col items-center justify-center gap-4 py-12 text-center md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Password Strength{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              Create, evaluate, and manage your passwords with confidence. Ensure your digital life stays secure with
              PSI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-3xl mx-auto my-8"
          >
            <HeroAnimation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Link to="/auth">
              <Button size="lg" className="gap-1">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>
        </section>

        {/* Password Strength Demo */}
        <section className="container-fluid py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              See Your Password Strength in Real-Time
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Try our interactive password strength evaluator and see how PSI can help you create stronger passwords.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-12 max-w-3xl"
          >
            <PasswordStrengthDemo />
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="container-fluid py-12 md:py-24 bg-muted/50 rounded-3xl">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Powerful Password Management
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              PSI offers a comprehensive suite of tools to keep your passwords secure and accessible.
            </motion.p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
            <FeatureCard
              icon={<Lock className="h-10 w-10 text-primary" />}
              title="Password Creation"
              description="Generate strong, unique passwords tailored to specific website requirements."
              delay={0}
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Security Evaluation"
              description="Analyze your existing passwords and get actionable recommendations."
              delay={0.2}
            />
            <FeatureCard
              icon={<Star className="h-10 w-10 text-primary" />}
              title="Secure Storage"
              description="Store your passwords with military-grade encryption for peace of mind."
              delay={0.4}
            />
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="container-fluid py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How PSI Works</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Simple, secure, and effective password management in three easy steps.
            </p>
          </motion.div>
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Create",
                  description: "Generate strong, unique passwords or import your existing ones.",
                },
                {
                  step: "02",
                  title: "Evaluate",
                  description: "Get detailed security analysis and improvement suggestions.",
                },
                {
                  step: "03",
                  title: "Manage",
                  description: "Securely store and access your passwords across all your devices.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-xl font-bold">{item.step}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="container-fluid py-12 md:py-24 bg-muted/50 rounded-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Trusted by Thousands</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our users have to say about PSI.
            </p>
          </motion.div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            <TestimonialCard
              quote="PSI has completely transformed how I manage my passwords. I feel so much more secure now."
              author="Alex Johnson"
              role="Software Developer"
              delay={0}
            />
            <TestimonialCard
              quote="The password strength analyzer is incredible. It helped me identify and fix all my weak passwords."
              author="Sarah Chen"
              role="Digital Marketer"
              delay={0.2}
            />
            <TestimonialCard
              quote="I've tried many password managers, but PSI stands out with its intuitive interface and powerful features."
              author="Michael Rodriguez"
              role="IT Professional"
              delay={0.4}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="container-fluid py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-5xl rounded-3xl bg-primary p-8 text-primary-foreground md:p-12 lg:p-16"
          >
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Secure Your Passwords?
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed">
                  Join thousands of users who trust PSI for their password security needs.
                </p>
              </div>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="w-full md:w-auto">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container-fluid flex flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">PSI</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PSI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
