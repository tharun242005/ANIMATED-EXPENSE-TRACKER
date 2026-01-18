import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Wallet, CreditCard, PiggyBank, Banknote, Landmark, TrendingUp, CircleDollarSign, Edit3, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from './auth-context';
import { getServerUrl } from '../utils/supabase/client';
import { PageLoader } from './animated-loader';
import { toast } from 'sonner@2.0.3';

const accountIcons: any = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  cash: Banknote,
  current: Landmark,
  investment: TrendingUp,
  wallet: CircleDollarSign,
};

const accountColors: any = {
  checking: 'from-blue-500 to-cyan-500',
  savings: 'from-green-500 to-emerald-500',
  credit: 'from-orange-500 to-red-500',
  cash: 'from-yellow-500 to-amber-500',
  current: 'from-purple-500 to-violet-500',
  investment: 'from-fuchsia-500 to-pink-500',
  wallet: 'from-indigo-500 to-blue-500',
};

export function AccountsPage() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const response = await fetch(getServerUrl('/accounts'), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const response = await fetch(getServerUrl('/accounts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          balance: parseFloat(formData.balance),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      toast.success('Account created successfully!');
      setDialogOpen(false);
      setFormData({ name: '', type: 'checking', balance: '' });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this account?')) {
      return;
    }

    try {
      const response = await fetch(getServerUrl(`/accounts/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      toast.success('Account deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Accounts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Manage your financial accounts
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
                Add Account
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chase Checking"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Account Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking Account</SelectItem>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="current">Current Account</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="investment">Investment Account</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="balance">Initial Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                  required
                  className="mt-1.5"
                />
              </div>

              <Button type="submit" className="w-full">
                Add Account
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600 text-white border-0 shadow-xl shadow-violet-500/20 overflow-hidden relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-sm opacity-90">Total Balance</p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setHideBalances(!hideBalances)}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {hideBalances ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
                <AnimatePresence mode="wait">
                  {hideBalances ? (
                    <motion.p
                      key="hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-5xl font-bold"
                    >
                      ₹••••••
                    </motion.p>
                  ) : (
                    <motion.p
                      key="visible"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-5xl font-bold"
                    >
                      ₹{totalBalance.toFixed(2)}
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm opacity-80 mt-2"
                >
                  Across {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
                </motion.p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Wallet className="w-10 h-10 text-white" />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Accounts Grid */}
      <AnimatePresence>
        {accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account, index) => {
              const Icon = accountIcons[account.type] || Wallet;

              const gradientColors = accountColors[account.type] || 'from-gray-500 to-gray-600';

              return (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredCard(account.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Card className="hover:shadow-xl transition-shadow overflow-hidden relative group">
                      {/* Animated top border */}
                      <motion.div
                        className={`h-2 bg-gradient-to-r ${gradientColors}`}
                        animate={{
                          backgroundPosition: hoveredCard === account.id ? ['0% 50%', '100% 50%'] : '0% 50%',
                        }}
                        transition={{
                          duration: 2,
                          repeat: hoveredCard === account.id ? Infinity : 0,
                        }}
                        style={{
                          backgroundSize: '200% 100%',
                        }}
                      />
                      
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColors} flex items-center justify-center shadow-lg`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <CardTitle className="group-hover:text-primary transition-colors">
                              {account.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground capitalize">
                              {account.type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(account.id)}
                          className="text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </CardHeader>

                      <CardContent>
                        <AnimatePresence mode="wait">
                          {hideBalances ? (
                            <motion.p
                              key="hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-3xl text-muted-foreground"
                            >
                              ₹••••••
                            </motion.p>
                          ) : (
                            <motion.p
                              key="visible"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className={`text-3xl ${
                                account.balance >= 0 ? 'text-foreground' : 'text-red-600'
                              }`}
                            >
                              ₹{account.balance.toFixed(2)}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Hover indicator */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: hoveredCard === account.id ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`h-1 mt-3 rounded-full bg-gradient-to-r ${gradientColors} origin-left`}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
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
            No accounts yet
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
