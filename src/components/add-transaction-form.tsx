import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useAuth } from './auth-context';
import { getServerUrl } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { ReceiptManager } from './receipt-manager';

interface AddTransactionFormProps {
  accounts: any[];
  categories: any[];
  onSuccess: () => void;
}

export function AddTransactionForm({ accounts, categories, onSuccess }: AddTransactionFormProps) {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    accountId: '',
    merchant: '',
    notes: '',
  });

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  function handleReceiptUpload(file: File, preview: string) {
    setReceiptFile(file);
    setReceiptPreview(preview);
  }

  function handleReceiptRemove() {
    setReceiptFile(null);
    setReceiptPreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(getServerUrl('/transactions'), {
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
        throw new Error(data.error || 'Failed to add transaction');
      }

      toast.success('Transaction added successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value, categoryId: '' })}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
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
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="mt-1.5"
        />
      </div>

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
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Account</Label>
        <Select
          value={formData.accountId}
          onValueChange={(value) => setFormData({ ...formData, accountId: value })}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="merchant">Merchant/Payee</Label>
        <Input
          id="merchant"
          value={formData.merchant}
          onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
          placeholder="e.g., Walmart, John Doe"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Optional notes"
          className="mt-1.5"
        />
      </div>

      {/* Receipt Upload */}
      <div>
        <Label>Receipt (Optional)</Label>
        <div className="mt-1.5">
          <ReceiptManager
            onReceiptUpload={handleReceiptUpload}
            onReceiptRemove={handleReceiptRemove}
            existingReceipt={receiptPreview}
          />
        </div>
      </div>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Adding...' : 'Add Transaction'}
        </Button>
      </motion.div>
    </form>
  );
}
