import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, X, RefreshCw } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const financialTips = [
  "💡 Save at least 20% of your income each month for emergencies and future goals.",
  "📊 Track every expense for a month to identify areas where you can cut back.",
  "🎯 Set specific, measurable financial goals with realistic timelines.",
  "💳 Pay off high-interest debt first to save money on interest payments.",
  "🏦 Build an emergency fund covering 3-6 months of living expenses.",
  "📈 Invest early and consistently - even small amounts compound over time.",
  "🔄 Automate your savings to ensure you pay yourself first every month.",
  "🛡️ Review and optimize your insurance coverage annually.",
  "📱 Use budgeting apps to stay on top of your spending habits.",
  "🎓 Invest in yourself through education and skill development.",
  "💰 Negotiate your salary - you could be leaving money on the table.",
  "🌱 Start investing as early as possible to benefit from compound interest.",
  "📉 Avoid lifestyle inflation when your income increases.",
  "🔍 Review subscriptions quarterly and cancel unused services.",
  "🎁 Use the 24-hour rule before making impulse purchases.",
  "💎 Focus on value, not just price, when making purchase decisions.",
  "📝 Create multiple income streams to increase financial security.",
  "🏡 Consider the total cost of ownership before major purchases.",
  "💪 Build good credit habits - they'll save you money long-term.",
  "🎯 Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "📆 Review your budget monthly and adjust as needed.",
  "🌟 Celebrate financial milestones to stay motivated.",
  "🔐 Protect your financial information and monitor for fraud regularly.",
  "📊 Diversify your investments to manage risk effectively.",
  "💼 Maximize employer benefits like 401(k) matching - it's free money!",
];

export function FinancialTip() {
  const [currentTip, setCurrentTip] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Set a random tip on mount
    setCurrentTip(getRandomTip());
  }, []);

  function getRandomTip() {
    return financialTips[Math.floor(Math.random() * financialTips.length)];
  }

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentTip(getRandomTip());
      setIsRefreshing(false);
    }, 300);
  }

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
              >
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-2 text-amber-900 dark:text-amber-100">
                  💡 <strong>Financial Tip</strong>
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTip}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-amber-800 dark:text-amber-200"
                  >
                    {currentTip}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRefresh}
                  className="p-1 rounded-md hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors"
                  title="Get another tip"
                >
                  <RefreshCw className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsVisible(false)}
                  className="p-1 rounded-md hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors"
                  title="Dismiss"
                >
                  <X className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                </motion.button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
