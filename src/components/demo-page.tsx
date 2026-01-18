import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, TrendingUp, PieChart, Wallet, Zap, Target, CheckCircle2, ArrowRight, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface DemoPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const demoTransactions = [
  { id: 1, merchant: 'Coffee Shop', amount: 450, category: '☕ Food & Dining', date: 'Today', color: '#ef4444' },
  { id: 2, merchant: 'Uber', amount: 280, category: '🚗 Transportation', date: 'Today', color: '#f59e0b' },
  { id: 3, merchant: 'Amazon', amount: 1299, category: '🛒 Shopping', date: 'Yesterday', color: '#8b5cf6' },
  { id: 4, merchant: 'Netflix', amount: 649, category: '🎬 Entertainment', date: 'Yesterday', color: '#ec4899' },
];

const demoSpendingData = [
  { name: 'Food', value: 4500, color: '#ef4444' },
  { name: 'Transport', value: 2800, color: '#f59e0b' },
  { name: 'Shopping', value: 5200, color: '#8b5cf6' },
  { name: 'Entertainment', value: 1800, color: '#ec4899' },
  { name: 'Bills', value: 3200, color: '#3b82f6' },
];

const demoTrendData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 58000 },
];

const features = [
  { icon: Zap, title: 'Quick Add', description: 'Type "₹500 lunch" and we handle the rest' },
  { icon: Brain, title: 'AI Insights', description: 'Smart spending tips powered by AI' },
  { icon: PieChart, title: 'Visual Analytics', description: 'Beautiful charts that make sense' },
  { icon: Target, title: 'Budget Goals', description: 'Set and track your financial targets' },
];

export function DemoPage({ onBack, onGetStarted }: DemoPageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Dashboard Overview',
    'Transaction Tracking',
    'Visual Analytics',
    'Key Features'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-950 to-cyan-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              variant="outline"
              className="gap-2 border-violet-400/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex gap-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    currentStep === index
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                      : 'bg-white/10 text-violet-200 hover:bg-white/20'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <Button
              onClick={onGetStarted}
              className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <motion.h1
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent"
          >
            {steps[currentStep]}
          </motion.h1>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 pb-12">
          <AnimatePresence mode="wait">
            {/* Step 0: Dashboard Overview */}
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto"
              >
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30 backdrop-blur-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-300 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Total Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="text-4xl font-bold text-white"
                      >
                        ₹1,24,500
                      </motion.p>
                      <p className="text-green-200 text-sm mt-2">+12.5% this month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-400/30 backdrop-blur-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-red-300 flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Total Expenses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="text-4xl font-bold text-white"
                      >
                        ₹58,200
                      </motion.p>
                      <p className="text-red-200 text-sm mt-2">This month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-400/30 backdrop-blur-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-violet-300 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Budget Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                        className="text-4xl font-bold text-white"
                      >
                        73%
                      </motion.p>
                      <p className="text-violet-200 text-sm mt-2">On track</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white/5 backdrop-blur-lg border-violet-400/20">
                  <CardHeader>
                    <CardTitle className="text-white">Spending Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={demoTrendData}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="month" stroke="#e0e7ff" />
                        <YAxis stroke="#e0e7ff" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e1b4b', 
                            border: '1px solid #8b5cf6',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                          formatter={(value: any) => [`₹${value}`, 'Spending']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#8b5cf6" 
                          fillOpacity={1} 
                          fill="url(#colorAmount)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 1: Transaction Tracking */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-white/5 backdrop-blur-lg border-violet-400/20 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {demoTransactions.map((transaction, index) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                              style={{ backgroundColor: `${transaction.color}20` }}
                            >
                              {transaction.category.split(' ')[0]}
                            </div>
                            <div>
                              <p className="text-white font-medium">{transaction.merchant}</p>
                              <p className="text-sm text-violet-300">{transaction.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">-₹{transaction.amount}</p>
                            <p className="text-sm text-violet-300">{transaction.date}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-400/30 rounded-2xl p-6 backdrop-blur-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-semibold text-white">Quick Add Magic</h3>
                  </div>
                  <p className="text-violet-100 mb-4">
                    Simply type in natural language like "₹500 lunch at Cafe Coffee Day" and Momentum automatically extracts:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-sm text-violet-300">Amount</p>
                      <p className="text-lg font-semibold text-white">₹500</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-sm text-violet-300">Category</p>
                      <p className="text-lg font-semibold text-white">☕ Food</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-sm text-violet-300">Merchant</p>
                      <p className="text-lg font-semibold text-white">Cafe Coffee Day</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Visual Analytics */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 backdrop-blur-lg border-violet-400/20">
                    <CardHeader>
                      <CardTitle className="text-white">Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPie>
                          <Pie
                            data={demoSpendingData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {demoSpendingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => `₹${value}`} />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <Card className="bg-white/5 backdrop-blur-lg border-violet-400/20">
                      <CardHeader>
                        <CardTitle className="text-white">Top Spending Categories</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {demoSpendingData.map((category, index) => (
                          <motion.div
                            key={category.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{category.name}</span>
                              <span className="text-violet-300">₹{category.value}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(category.value / 5200) * 100}%` }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                className="h-2 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Key Features */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-lg border border-violet-400/20 rounded-2xl p-6 hover:border-violet-400/50 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-6 h-6 text-violet-300" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                          <p className="text-violet-200">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-2xl p-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                  <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                    Join thousands of users who are already gaining financial momentum with our AI-powered expense tracker.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={onGetStarted}
                      size="lg"
                      className="gap-2 bg-white text-violet-600 hover:bg-white/90 text-lg px-8"
                    >
                      Create Free Account
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(0)}
                      size="lg"
                      variant="outline"
                      className="gap-2 border-white/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg px-8"
                    >
                      Replay Demo
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-8 mt-8 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Free forever</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-12">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
              className="border-violet-400/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
              disabled={currentStep === 3}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
