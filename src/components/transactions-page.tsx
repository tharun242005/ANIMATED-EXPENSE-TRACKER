import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit, Filter, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from './auth-context';
import { getServerUrl } from '../utils/supabase/client';
import { PageLoader } from './animated-loader';
import { AddTransactionForm } from './add-transaction-form';
import { toast } from 'sonner@2.0.3';
import { getCategoryEmoji } from '../utils/category-emojis';

export function TransactionsPage() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [transRes, accountRes, categoryRes] = await Promise.all([
        fetch(getServerUrl('/transactions'), {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }),
        fetch(getServerUrl('/accounts'), {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }),
        fetch(getServerUrl('/categories'), {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }),
      ]);

      const [transData, accountData, categoryData] = await Promise.all([
        transRes.json(),
        accountRes.json(),
        categoryRes.json(),
      ]);

      setTransactions(transData.transactions || []);
      setAccounts(accountData.accounts || []);
      setCategories(categoryData.categories || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await fetch(getServerUrl(`/transactions/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      toast.success('Transaction deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete transaction');
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (searchTerm) {
        const category = categories.find((c) => c.id === t.categoryId);
        const searchLower = searchTerm.toLowerCase();
        return (
          category?.name.toLowerCase().includes(searchLower) ||
          t.merchant?.toLowerCase().includes(searchLower) ||
          t.notes?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Transactions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Manage your income and expenses
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
                Add Transaction
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <AddTransactionForm
              accounts={accounts}
              categories={categories}
              onSuccess={() => {
                setDialogOpen(false);
                loadData();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="pl-10"
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Transactions List */}
      <AnimatePresence>
        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => {
              const category = categories.find((c) => c.id === transaction.categoryId);
              const account = accounts.find((a) => a.id === transaction.accountId);

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${category?.color || '#888'}20` }}
                          >
                            {category ? getCategoryEmoji(category.name) : '📁'}
                          </div>
                          <div>
                            <p>{category?.name || 'Unknown'}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{new Date(transaction.date).toLocaleDateString()}</span>
                              {transaction.merchant && (
                                <>
                                  <span>•</span>
                                  <span>{transaction.merchant}</span>
                                </>
                              )}
                              {account && (
                                <>
                                  <span>•</span>
                                  <span>{account.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className={`${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                        </p>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(transaction.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {transaction.notes && (
                      <p className="text-sm text-muted-foreground mt-2 pl-6">
                        {transaction.notes}
                      </p>
                    )}
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
            {searchTerm || filterType !== 'all' ? 'No transactions found' : 'No transactions yet'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
