import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from './auth-context';
import { getServerUrl } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface ParsedTransaction {
  amount: number;
  description: string;
  merchant?: string;
  categoryId?: string;
  suggestedCategory?: string;
  date: string;
  type: 'income' | 'expense';
}

interface QuickAddBarProps {
  accounts: any[];
  categories: any[];
  onTransactionAdded: () => void;
}

export function QuickAddBar({ accounts, categories, onTransactionAdded }: QuickAddBarProps) {
  const { accessToken } = useAuth();
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<ParsedTransaction | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processing, setProcessing] = useState(false);

  function parseInput(text: string): ParsedTransaction | null {
    try {
      // Enhanced NLP-like parsing
      const words = text.toLowerCase().split(/\s+/);
      
      // Extract amount (look for ₹ or numbers)
      let amount = 0;
      let amountIndex = -1;
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i].replace(/[₹,]/g, '');
        const num = parseFloat(word);
        if (!isNaN(num) && num > 0) {
          amount = num;
          amountIndex = i;
          break;
        }
      }

      if (amount === 0) return null;

      // Determine type (income vs expense)
      const incomeKeywords = ['salary', 'income', 'earned', 'received', 'bonus', 'refund'];
      const isIncome = incomeKeywords.some(keyword => text.toLowerCase().includes(keyword));
      const type = isIncome ? 'income' : 'expense';

      // Extract date
      const today = new Date();
      let date = today.toISOString().split('T')[0];
      
      if (text.includes('yesterday')) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        date = yesterday.toISOString().split('T')[0];
      } else if (text.includes('tomorrow')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        date = tomorrow.toISOString().split('T')[0];
      }

      // Date pattern matching (e.g., "on 25th", "on 5/12")
      const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})|(\d{1,2})(st|nd|rd|th)/);
      if (dateMatch) {
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        if (dateMatch[1] && dateMatch[2]) {
          // MM/DD format
          const month = parseInt(dateMatch[1]) - 1;
          const day = parseInt(dateMatch[2]);
          date = new Date(currentYear, month, day).toISOString().split('T')[0];
        } else if (dateMatch[3]) {
          // Day with suffix (5th, 12th, etc.)
          const day = parseInt(dateMatch[3]);
          date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
        }
      }

      // Extract merchant/description
      const prepositions = ['at', 'from', 'to', 'for', 'on'];
      let merchant = '';
      let description = '';
      
      for (let i = 0; i < words.length; i++) {
        if (prepositions.includes(words[i]) && i + 1 < words.length) {
          const merchantWords = [];
          for (let j = i + 1; j < words.length; j++) {
            if (words[j] === 'yesterday' || words[j] === 'today' || words[j] === 'tomorrow') break;
            merchantWords.push(words[j]);
          }
          merchant = merchantWords.join(' ');
          break;
        }
      }

      // Build description from remaining words
      const descWords = words.filter((w, i) => {
        return i !== amountIndex && 
               !prepositions.includes(w) && 
               !['yesterday', 'today', 'tomorrow', '₹'].includes(w) &&
               !w.match(/^\d+$/) &&
               !merchant.toLowerCase().includes(w);
      });
      description = descWords.join(' ') || merchant || 'Quick add expense';

      // Smart category suggestion based on keywords
      const categoryKeywords: { [key: string]: string[] } = {
        'food': ['lunch', 'dinner', 'breakfast', 'meal', 'food', 'restaurant', 'cafe', 'coffee', 'snack'],
        'groceries': ['groceries', 'supermarket', 'market', 'vegetables', 'fruits'],
        'transport': ['uber', 'taxi', 'bus', 'metro', 'train', 'fuel', 'gas', 'petrol'],
        'shopping': ['shopping', 'clothes', 'shoes', 'amazon', 'flipkart', 'mall'],
        'entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'game', 'concert'],
        'bills': ['electricity', 'water', 'internet', 'phone', 'rent', 'bill'],
        'health': ['doctor', 'medicine', 'pharmacy', 'hospital', 'clinic', 'gym'],
      };

      let suggestedCategory = '';
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
          suggestedCategory = category;
          break;
        }
      }

      // Try to match with existing categories
      let categoryId;
      if (suggestedCategory) {
        const matchedCategory = categories.find(c => 
          c.name.toLowerCase().includes(suggestedCategory) ||
          suggestedCategory.includes(c.name.toLowerCase())
        );
        categoryId = matchedCategory?.id;
      }

      return {
        amount,
        description: description.charAt(0).toUpperCase() + description.slice(1),
        merchant: merchant ? merchant.charAt(0).toUpperCase() + merchant.slice(1) : undefined,
        categoryId,
        suggestedCategory: suggestedCategory.charAt(0).toUpperCase() + suggestedCategory.slice(1),
        date,
        type,
      };
    } catch (error) {
      console.error('Parse error:', error);
      return null;
    }
  }

  function handleParse() {
    if (!input.trim()) return;
    
    const result = parseInput(input);
    if (result) {
      setParsed(result);
      setShowConfirmation(true);
    } else {
      toast.error('Could not parse input. Try: "₹500 lunch at Subway yesterday"');
    }
  }

  async function handleConfirm() {
    if (!parsed) return;
    
    setProcessing(true);
    try {
      const defaultAccount = accounts.find(a => a.name.toLowerCase().includes('main')) || accounts[0];
      
      const response = await fetch(getServerUrl('/transactions'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: parsed.amount,
          type: parsed.type,
          categoryId: parsed.categoryId || categories[0]?.id,
          accountId: defaultAccount?.id,
          date: parsed.date,
          description: parsed.description,
          merchant: parsed.merchant,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add transaction');
      }

      toast.success('Transaction added successfully! 🎉');
      setInput('');
      setParsed(null);
      setShowConfirmation(false);
      onTransactionAdded();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add transaction');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-lg blur opacity-25" />
        <div className="relative bg-card border border-primary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-semibold">Magic Quick-Add</span>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleParse();
                }
              }}
              placeholder='Try: "₹500 lunch at Subway yesterday" or "₹5000 salary received"'
              className="flex-1 bg-input-background border-primary/20"
            />
            <Button
              onClick={handleParse}
              disabled={!input.trim()}
              className="gap-2 bg-gradient-to-r from-primary to-accent"
            >
              <Zap className="w-4 h-4" />
              Parse
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Use natural language to add transactions instantly. AI will automatically categorize and parse your input.
          </p>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && parsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-primary/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Confirm Transaction</h3>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/30"
                >
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-xl font-bold text-accent">
                    {parsed.type === 'income' ? '+' : '-'}₹{parsed.amount.toFixed(2)}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30"
                >
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-semibold capitalize">{parsed.type}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-muted-foreground">Description</span>
                  <span className="font-medium">{parsed.description}</span>
                </motion.div>

                {parsed.merchant && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-muted-foreground">Merchant</span>
                    <span className="font-medium">{parsed.merchant}</span>
                  </motion.div>
                )}

                {parsed.suggestedCategory && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-muted-foreground">Category (AI)</span>
                    <span className="font-medium flex items-center gap-2">
                      {parsed.suggestedCategory}
                      {parsed.categoryId && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </span>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {new Date(parsed.date).toLocaleDateString()}
                  </span>
                </motion.div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent"
                  disabled={processing}
                >
                  <Check className="w-4 h-4" />
                  {processing ? 'Adding...' : 'Confirm'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
