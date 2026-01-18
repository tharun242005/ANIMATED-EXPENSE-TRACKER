import { motion } from 'motion/react';
import { ArrowRight, Zap, TrendingUp, PieChart, Brain, Shield, Sparkles, Target, Rocket, Receipt, Repeat, Award } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-950 to-cyan-950 overflow-hidden text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-500/30 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                Momentum
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button 
                onClick={onGetStarted} 
                variant="outline" 
                className="gap-2 border-violet-400/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-400/30 backdrop-blur-sm mb-6"
              >
                <Sparkles className="w-4 h-4 text-violet-300" />
                <span className="text-sm text-violet-200">AI-Powered Financial Tracking</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                Gain Financial{' '}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  Momentum
                </span>
                <br />
                Effortlessly.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-violet-100 mb-8"
              >
                Track expenses with natural language, visualize your spending with stunning animated charts, and achieve your financial goals with AI-powered insights.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/50 text-lg px-8 border-0"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent('openDemo'))}
                  size="lg"
                  variant="outline"
                  className="gap-2 border-violet-400/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg px-8"
                >
                  <Zap className="w-5 h-5" />
                  See Demo
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 mt-8 text-sm text-violet-200"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-fuchsia-400" />
                  <span>AI-Powered</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-violet-400/30 shadow-2xl shadow-violet-500/30 backdrop-blur-sm">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1576424298865-5e5380c19c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwZmluYW5jaWFsJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2MTU3Njg0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Momentum Dashboard Preview"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-950/80 to-transparent" />
              </div>
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-4 top-1/4 bg-white/10 backdrop-blur-lg border border-violet-400/30 rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-violet-200">Savings</p>
                    <p className="text-lg font-bold text-white">+₹12,500</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -right-4 bottom-1/4 bg-white/10 backdrop-blur-lg border border-fuchsia-400/30 rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-violet-200">Goal Progress</p>
                    <p className="text-lg font-bold text-white">87%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Why Choose Momentum?
            </h2>
            <p className="text-xl text-violet-100 max-w-2xl mx-auto">
              Experience the future of expense tracking with cutting-edge features designed for your success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white/5 backdrop-blur-lg border border-violet-400/20 rounded-2xl p-6 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/20 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-violet-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-violet-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Visualization Preview */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                Beautiful Data Visualization
              </h2>
              <p className="text-xl text-violet-100 mb-6">
                See your finances come to life with interactive charts, animated transitions, and real-time insights.
              </p>
              <ul className="space-y-3">
                {[
                  'Interactive pie charts and bar graphs',
                  'Real-time spending trends',
                  'Category-based breakdowns',
                  'Customizable date ranges',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
                    </div>
                    <span className="text-violet-100">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0c3xlbnwxfHx8fDE3NjE2MDUzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Data Visualization"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Additional Features Showcase */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-lg border border-violet-400/20 rounded-2xl p-8 hover:border-violet-400/50 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/50">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Receipt Scanner</h3>
              <p className="text-violet-200 mb-4">
                Upload receipts and let our AI extract amounts, merchants, and dates automatically. Never lose track of a transaction again.
              </p>
              <div className="relative rounded-lg overflow-hidden border border-violet-400/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1665656653092-684fdd316aca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZmluYW5jZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYxNTgyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Receipt Scanner"
                  className="w-full h-48 object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 backdrop-blur-lg border border-fuchsia-400/20 rounded-2xl p-8 hover:border-fuchsia-400/50 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg shadow-fuchsia-500/50">
                <Repeat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Subscription Tracker</h3>
              <p className="text-violet-200 mb-4">
                Automatically detect recurring payments and subscriptions. Get alerts before renewals and easily identify unused services.
              </p>
              <div className="relative rounded-lg overflow-hidden border border-fuchsia-400/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1757301714935-c8127a21abc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJzY3JpcHRpb24lMjBwYXltZW50c3xlbnwxfHx8fDE3NjE2MzAyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Subscription Tracker"
                  className="w-full h-48 object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/20 rounded-2xl p-8 hover:border-cyan-400/50 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/50">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Gamification</h3>
              <p className="text-violet-200 mb-4">
                Stay motivated with achievement badges, savings streaks, and celebratory animations when you hit your financial goals.
              </p>
              <div className="relative rounded-lg overflow-hidden border border-cyan-400/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1681826291722-70bd7e9e6fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBiYW5raW5nJTIwYXBwfGVufDF8fHx8MTc2MTYxMTUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Gamification"
                  className="w-full h-48 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative p-12 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already gained financial momentum.
              </p>
              <Button
                onClick={onGetStarted}
                size="lg"
                className="gap-2 bg-white text-violet-600 hover:bg-white/90 text-lg px-12 shadow-lg"
              >
                Start Your Journey
                <Rocket className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-violet-400/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white">Momentum</span>
            </div>
            <div className="flex gap-6 text-sm text-violet-200">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openPrivacyPolicy'))}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openTermsOfService'))}
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <a 
                href="mailto:run40081@gmail.com" 
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
            <p className="text-sm text-violet-300">
              © 2025 All rights reserved by Tharun P
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: 'Magic Quick-Add',
    description: 'Add expenses instantly with natural language. Just type "₹500 lunch at Cafe" and we\'ll handle the rest.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Smart category suggestions and automatic expense categorization that learns from your habits.',
  },
  {
    icon: TrendingUp,
    title: 'Intelligent Budgeting',
    description: 'Set budgets and track progress with visual indicators and real-time alerts.',
  },
  {
    icon: PieChart,
    title: 'Powerful Visualizations',
    description: 'Interactive charts and graphs that make understanding your finances effortless.',
  },
  {
    icon: Target,
    title: 'Multiple Accounts',
    description: 'Manage savings, checking, credit cards, and cash accounts all in one place.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Bank-level encryption with Supabase. Your financial data is always protected.',
  },
];
