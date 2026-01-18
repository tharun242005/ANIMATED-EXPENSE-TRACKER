import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Calendar, DollarSign, AlertCircle, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from './auth-context';
import { getServerUrl } from '../utils/supabase/client';

interface Subscription {
  id: string;
  merchant: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  nextBilling: string;
  categoryId: string;
  status: 'active' | 'canceled';
}

export function SubscriptionTracker() {
  const { accessToken } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectSubscriptions();
  }, []);

  async function detectSubscriptions() {
    try {
      const response = await fetch(getServerUrl('/transactions'), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      const data = await response.json();
      const transactions = data.transactions || [];

      // Detect recurring patterns
      const detected = findRecurringTransactions(transactions);
      setSubscriptions(detected);
    } catch (error) {
      console.error('Error detecting subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }

  function findRecurringTransactions(transactions: any[]): Subscription[] {
    const merchantGroups: { [key: string]: any[] } = {};

    // Group by merchant
    transactions.forEach((t: any) => {
      if (t.merchant && t.type === 'expense') {
        const merchant = t.merchant.toLowerCase();
        if (!merchantGroups[merchant]) {
          merchantGroups[merchant] = [];
        }
        merchantGroups[merchant].push(t);
      }
    });

    const subscriptions: Subscription[] = [];

    // Analyze patterns
    Object.entries(merchantGroups).forEach(([merchant, txns]) => {
      if (txns.length < 2) return;

      // Sort by date
      txns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Check for similar amounts
      const amounts = txns.map(t => t.amount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const amountVariance = amounts.every(a => Math.abs(a - avgAmount) / avgAmount < 0.1);

      if (!amountVariance) return;

      // Check for regular intervals
      const intervals = [];
      for (let i = 1; i < txns.length; i++) {
        const days = Math.floor(
          (new Date(txns[i].date).getTime() - new Date(txns[i - 1].date).getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        intervals.push(days);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const isMonthly = avgInterval >= 25 && avgInterval <= 35;
      const isYearly = avgInterval >= 350 && avgInterval <= 380;

      if (isMonthly || isYearly) {
        const lastTransaction = txns[txns.length - 1];
        const nextBilling = new Date(lastTransaction.date);
        nextBilling.setDate(nextBilling.getDate() + Math.round(avgInterval));

        subscriptions.push({
          id: merchant,
          merchant: merchant.charAt(0).toUpperCase() + merchant.slice(1),
          amount: avgAmount,
          frequency: isMonthly ? 'monthly' : 'yearly',
          nextBilling: nextBilling.toISOString().split('T')[0],
          categoryId: lastTransaction.categoryId,
          status: 'active',
        });
      }
    });

    return subscriptions;
  }

  const totalMonthly = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      return sum + (s.frequency === 'monthly' ? s.amount : s.amount / 12);
    }, 0);

  const upcomingThisMonth = subscriptions.filter(s => {
    const nextBilling = new Date(s.nextBilling);
    const now = new Date();
    return s.status === 'active' &&
           nextBilling.getMonth() === now.getMonth() &&
           nextBilling.getFullYear() === now.getFullYear();
  });

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            Subscription Tracker
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={detectSubscriptions}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30"
          >
            <p className="text-sm text-muted-foreground mb-1">Monthly Total</p>
            <p className="text-2xl font-bold text-primary">₹{totalMonthly.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/30"
          >
            <p className="text-sm text-muted-foreground mb-1">Active Subscriptions</p>
            <p className="text-2xl font-bold text-accent">
              {subscriptions.filter(s => s.status === 'active').length}
            </p>
          </motion.div>
        </div>

        {/* Subscription List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Detecting subscriptions...
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recurring subscriptions detected yet</p>
            <p className="text-sm">Add more transactions to help us identify patterns</p>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub, index) => {
              const daysUntilBilling = Math.floor(
                (new Date(sub.nextBilling).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
              );
              const isSoon = daysUntilBilling <= 7 && daysUntilBilling >= 0;

              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all ${
                    sub.status === 'canceled'
                      ? 'bg-muted/50 border-muted opacity-60'
                      : isSoon
                      ? 'bg-accent/10 border-accent/50'
                      : 'bg-card border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{sub.merchant}</h4>
                        {sub.status === 'canceled' ? (
                          <Badge variant="outline" className="text-xs">
                            Canceled
                          </Badge>
                        ) : isSoon ? (
                          <Badge className="text-xs bg-accent/20 text-accent border-accent">
                            Due Soon
                          </Badge>
                        ) : null}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>₹{sub.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          <span className="capitalize">{sub.frequency}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {daysUntilBilling >= 0
                              ? `${daysUntilBilling} days`
                              : 'Overdue'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {sub.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSubscriptions(prev =>
                              prev.map(s =>
                                s.id === sub.id ? { ...s, status: 'canceled' as const } : s
                              )
                            );
                          }}
                          className="h-8 px-2 text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Mark Canceled
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSubscriptions(prev =>
                              prev.map(s =>
                                s.id === sub.id ? { ...s, status: 'active' as const } : s
                              )
                            );
                          }}
                          className="h-8 px-2 text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {upcomingThisMonth.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-sm">
              <strong>{upcomingThisMonth.length}</strong> subscription{upcomingThisMonth.length > 1 ? 's' : ''} will be charged this month
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
