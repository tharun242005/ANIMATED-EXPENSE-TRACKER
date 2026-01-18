import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { useAuth } from './auth-context';
import { getServerUrl } from '../utils/supabase/client';
import { PageLoader } from './animated-loader';
import { toast } from 'sonner@2.0.3';
import { getCategoryEmoji } from '../utils/category-emojis';

export function BudgetsPage() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [budgetRes, categoryRes, transRes] = await Promise.all([
        fetch(getServerUrl('/budgets'), {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }),
        fetch(getServerUrl('/categories'), {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }),
        fetch(getServerUrl('/transactions'), {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }),
      ]);

      const [budgetData, categoryData, transData] = await Promise.all([
        budgetRes.json(),
        categoryRes.json(),
        transRes.json(),
      ]);

      setBudgets(budgetData.budgets || []);
      setCategories(categoryData.categories || []);
      setTransactions(transData.transactions || []);
    } catch (error) {
      console.error('Error loading budgets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const response = await fetch(getServerUrl('/budgets'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create budget');
      }

      toast.success('Budget created successfully!');
      setDialogOpen(false);
      setFormData({ categoryId: '', amount: '', period: 'monthly' });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create budget');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      const response = await fetch(getServerUrl(`/budgets/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      toast.success('Budget deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete budget');
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  // Calculate spending for each budget
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const budgetsWithSpending = budgets.map((budget) => {
    const spent = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === 'expense' &&
          t.categoryId === budget.categoryId &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (spent / budget.amount) * 100;
    const status = percentage >= 100 ? 'over' : percentage >= 80 ? 'warning' : 'good';

    return { ...budget, spent, percentage, status };
  });

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Budgets
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Set spending limits and track progress
          </motion.p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Budget
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) => setFormData({ ...formData, period: value })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Create Budget
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budgets Grid */}
      <AnimatePresence>
        {budgetsWithSpending.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetsWithSpending.map((budget, index) => {
              const category = categories.find((c) => c.id === budget.categoryId);

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${category?.color}20` }}
                        >
                          <Target className="w-6 h-6" style={{ color: category?.color }} />
                        </div>
                        <div>
                          <CardTitle>{category?.name || 'Unknown'}</CardTitle>
                          <p className="text-sm text-muted-foreground capitalize">{budget.period}</p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(budget.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-2xl">₹{budget.spent.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            of ₹{budget.amount.toFixed(2)}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${
                            budget.status === 'over'
                              ? 'bg-red-100 text-red-700'
                              : budget.status === 'warning'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {budget.percentage.toFixed(0)}%
                        </div>
                      </div>

                      <div>
                        <Progress
                          value={Math.min(budget.percentage, 100)}
                          className="h-3"
                          style={{
                            backgroundColor: budget.status === 'over'
                              ? '#fee2e2'
                              : budget.status === 'warning'
                              ? '#fef3c7'
                              : '#dcfce7',
                          }}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          ₹{(budget.amount - budget.spent).toFixed(2)} remaining
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-muted-foreground"
          >
            No budgets created yet
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
