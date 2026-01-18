import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to get authenticated user
async function getAuthenticatedUser(request: Request) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    console.log(`Authentication error: ${error?.message}`);
    return null;
  }
  
  return user;
}

// Health check endpoint
app.get("/make-server-638221b2/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Signup endpoint
app.post("/make-server-638221b2/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Initialize user data with default categories and a sample account
    const userId = data.user.id;
    const defaultCategories = [
      { id: crypto.randomUUID(), name: 'Groceries', icon: 'ShoppingCart', emoji: '🛒', color: '#10b981', type: 'expense' },
      { id: crypto.randomUUID(), name: 'Dining Out', icon: 'UtensilsCrossed', emoji: '🍽️', color: '#f59e0b', type: 'expense' },
      { id: crypto.randomUUID(), name: 'Rent', icon: 'Home', emoji: '🏠', color: '#ef4444', type: 'expense' },
      { id: crypto.randomUUID(), name: 'Utilities', icon: 'Zap', emoji: '⚡', color: '#3b82f6', type: 'expense' },
      { id: crypto.randomUUID(), name: 'Transportation', icon: 'Car', emoji: '🚗', color: '#8b5cf6', type: 'expense' },
      { id: crypto.randomUUID(), name: 'Entertainment', icon: 'Film', emoji: '🎬', color: '#ec4899', type: 'expense' },
      { id: crypto.randomUUID(), name: 'Healthcare', icon: 'Heart', emoji: '❤️', color: '#14b8a6', type: 'expense' },
      { id: crypto.randomUUID(), name: 'Shopping', icon: 'ShoppingBag', emoji: '🛍️', color: '#f97316', type: 'expense' },
      { id: crypto.randomUUID(), name: 'Salary', icon: 'Wallet', emoji: '💵', color: '#22c55e', type: 'income' },
      { id: crypto.randomUUID(), name: 'Other Income', icon: 'DollarSign', emoji: '💸', color: '#84cc16', type: 'income' },
    ];
    
    const defaultAccount = {
      id: crypto.randomUUID(),
      name: 'Main Account',
      type: 'checking',
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`user:${userId}:categories`, defaultCategories);
    await kv.set(`user:${userId}:accounts`, [defaultAccount]);
    await kv.set(`user:${userId}:transactions`, []);
    await kv.set(`user:${userId}:budgets`, []);
    await kv.set(`user:${userId}:profile`, { currency: 'USD' });
    
    return c.json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email: data.user.email,
        name: data.user.user_metadata?.name 
      } 
    });
  } catch (error) {
    console.log(`Signup error: ${error.message}`);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// ==================== TRANSACTION ROUTES ====================

app.get("/make-server-638221b2/transactions", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const transactions = await kv.get(`user:${user.id}:transactions`) || [];
    return c.json({ transactions });
  } catch (error) {
    console.log(`Error fetching transactions: ${error.message}`);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

app.post("/make-server-638221b2/transactions", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const transaction = await c.req.json();
    const transactions = await kv.get(`user:${user.id}:transactions`) || [];
    
    const newTransaction = {
      id: crypto.randomUUID(),
      ...transaction,
      createdAt: new Date().toISOString(),
    };
    
    transactions.push(newTransaction);
    await kv.set(`user:${user.id}:transactions`, transactions);
    
    // Update account balance
    const accounts = await kv.get(`user:${user.id}:accounts`) || [];
    const accountIndex = accounts.findIndex((a: any) => a.id === transaction.accountId);
    if (accountIndex !== -1) {
      const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      accounts[accountIndex].balance += amount;
      await kv.set(`user:${user.id}:accounts`, accounts);
    }
    
    return c.json({ transaction: newTransaction });
  } catch (error) {
    console.log(`Error creating transaction: ${error.message}`);
    return c.json({ error: 'Failed to create transaction' }, 500);
  }
});

app.put("/make-server-638221b2/transactions/:id", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const transactions = await kv.get(`user:${user.id}:transactions`) || [];
    
    const index = transactions.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return c.json({ error: 'Transaction not found' }, 404);
    }
    
    const oldTransaction = transactions[index];
    const updatedTransaction = { ...oldTransaction, ...updates };
    transactions[index] = updatedTransaction;
    
    await kv.set(`user:${user.id}:transactions`, transactions);
    
    // Update account balances if amount or account changed
    if (updates.amount !== undefined || updates.accountId !== undefined) {
      const accounts = await kv.get(`user:${user.id}:accounts`) || [];
      
      // Revert old balance
      const oldAccountIndex = accounts.findIndex((a: any) => a.id === oldTransaction.accountId);
      if (oldAccountIndex !== -1) {
        const oldAmount = oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
        accounts[oldAccountIndex].balance -= oldAmount;
      }
      
      // Apply new balance
      const newAccountIndex = accounts.findIndex((a: any) => a.id === updatedTransaction.accountId);
      if (newAccountIndex !== -1) {
        const newAmount = updatedTransaction.type === 'income' ? updatedTransaction.amount : -updatedTransaction.amount;
        accounts[newAccountIndex].balance += newAmount;
      }
      
      await kv.set(`user:${user.id}:accounts`, accounts);
    }
    
    return c.json({ transaction: updatedTransaction });
  } catch (error) {
    console.log(`Error updating transaction: ${error.message}`);
    return c.json({ error: 'Failed to update transaction' }, 500);
  }
});

app.delete("/make-server-638221b2/transactions/:id", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const transactions = await kv.get(`user:${user.id}:transactions`) || [];
    
    const index = transactions.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return c.json({ error: 'Transaction not found' }, 404);
    }
    
    const transaction = transactions[index];
    transactions.splice(index, 1);
    await kv.set(`user:${user.id}:transactions`, transactions);
    
    // Update account balance
    const accounts = await kv.get(`user:${user.id}:accounts`) || [];
    const accountIndex = accounts.findIndex((a: any) => a.id === transaction.accountId);
    if (accountIndex !== -1) {
      const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      accounts[accountIndex].balance -= amount;
      await kv.set(`user:${user.id}:accounts`, accounts);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting transaction: ${error.message}`);
    return c.json({ error: 'Failed to delete transaction' }, 500);
  }
});

// ==================== BUDGET ROUTES ====================

app.get("/make-server-638221b2/budgets", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const budgets = await kv.get(`user:${user.id}:budgets`) || [];
    return c.json({ budgets });
  } catch (error) {
    console.log(`Error fetching budgets: ${error.message}`);
    return c.json({ error: 'Failed to fetch budgets' }, 500);
  }
});

app.post("/make-server-638221b2/budgets", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const budget = await c.req.json();
    const budgets = await kv.get(`user:${user.id}:budgets`) || [];
    
    const newBudget = {
      id: crypto.randomUUID(),
      ...budget,
      createdAt: new Date().toISOString(),
    };
    
    budgets.push(newBudget);
    await kv.set(`user:${user.id}:budgets`, budgets);
    
    return c.json({ budget: newBudget });
  } catch (error) {
    console.log(`Error creating budget: ${error.message}`);
    return c.json({ error: 'Failed to create budget' }, 500);
  }
});

app.put("/make-server-638221b2/budgets/:id", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const budgets = await kv.get(`user:${user.id}:budgets`) || [];
    
    const index = budgets.findIndex((b: any) => b.id === id);
    if (index === -1) {
      return c.json({ error: 'Budget not found' }, 404);
    }
    
    budgets[index] = { ...budgets[index], ...updates };
    await kv.set(`user:${user.id}:budgets`, budgets);
    
    return c.json({ budget: budgets[index] });
  } catch (error) {
    console.log(`Error updating budget: ${error.message}`);
    return c.json({ error: 'Failed to update budget' }, 500);
  }
});

app.delete("/make-server-638221b2/budgets/:id", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const budgets = await kv.get(`user:${user.id}:budgets`) || [];
    
    const index = budgets.findIndex((b: any) => b.id === id);
    if (index === -1) {
      return c.json({ error: 'Budget not found' }, 404);
    }
    
    budgets.splice(index, 1);
    await kv.set(`user:${user.id}:budgets`, budgets);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting budget: ${error.message}`);
    return c.json({ error: 'Failed to delete budget' }, 500);
  }
});

// ==================== ACCOUNT ROUTES ====================

app.get("/make-server-638221b2/accounts", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const accounts = await kv.get(`user:${user.id}:accounts`) || [];
    return c.json({ accounts });
  } catch (error) {
    console.log(`Error fetching accounts: ${error.message}`);
    return c.json({ error: 'Failed to fetch accounts' }, 500);
  }
});

app.post("/make-server-638221b2/accounts", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const account = await c.req.json();
    const accounts = await kv.get(`user:${user.id}:accounts`) || [];
    
    const newAccount = {
      id: crypto.randomUUID(),
      ...account,
      balance: account.balance || 0,
      createdAt: new Date().toISOString(),
    };
    
    accounts.push(newAccount);
    await kv.set(`user:${user.id}:accounts`, accounts);
    
    return c.json({ account: newAccount });
  } catch (error) {
    console.log(`Error creating account: ${error.message}`);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

app.put("/make-server-638221b2/accounts/:id", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const accounts = await kv.get(`user:${user.id}:accounts`) || [];
    
    const index = accounts.findIndex((a: any) => a.id === id);
    if (index === -1) {
      return c.json({ error: 'Account not found' }, 404);
    }
    
    accounts[index] = { ...accounts[index], ...updates };
    await kv.set(`user:${user.id}:accounts`, accounts);
    
    return c.json({ account: accounts[index] });
  } catch (error) {
    console.log(`Error updating account: ${error.message}`);
    return c.json({ error: 'Failed to update account' }, 500);
  }
});

app.delete("/make-server-638221b2/accounts/:id", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const accounts = await kv.get(`user:${user.id}:accounts`) || [];
    
    const index = accounts.findIndex((a: any) => a.id === id);
    if (index === -1) {
      return c.json({ error: 'Account not found' }, 404);
    }
    
    // Check if there are transactions using this account
    const transactions = await kv.get(`user:${user.id}:transactions`) || [];
    const hasTransactions = transactions.some((t: any) => t.accountId === id);
    
    if (hasTransactions) {
      return c.json({ error: 'Cannot delete account with existing transactions' }, 400);
    }
    
    accounts.splice(index, 1);
    await kv.set(`user:${user.id}:accounts`, accounts);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting account: ${error.message}`);
    return c.json({ error: 'Failed to delete account' }, 500);
  }
});

// ==================== CATEGORY ROUTES ====================

app.get("/make-server-638221b2/categories", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const categories = await kv.get(`user:${user.id}:categories`) || [];
    return c.json({ categories });
  } catch (error) {
    console.log(`Error fetching categories: ${error.message}`);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

app.post("/make-server-638221b2/categories", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const category = await c.req.json();
    const categories = await kv.get(`user:${user.id}:categories`) || [];
    
    const newCategory = {
      id: crypto.randomUUID(),
      ...category,
      createdAt: new Date().toISOString(),
    };
    
    categories.push(newCategory);
    await kv.set(`user:${user.id}:categories`, categories);
    
    return c.json({ category: newCategory });
  } catch (error) {
    console.log(`Error creating category: ${error.message}`);
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

app.put("/make-server-638221b2/categories/:id", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const categories = await kv.get(`user:${user.id}:categories`) || [];
    
    const index = categories.findIndex((cat: any) => cat.id === id);
    if (index === -1) {
      return c.json({ error: 'Category not found' }, 404);
    }
    
    categories[index] = { ...categories[index], ...updates };
    await kv.set(`user:${user.id}:categories`, categories);
    
    return c.json({ category: categories[index] });
  } catch (error) {
    console.log(`Error updating category: ${error.message}`);
    return c.json({ error: 'Failed to update category' }, 500);
  }
});

app.delete("/make-server-638221b2/categories/:id", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const id = c.req.param('id');
    const categories = await kv.get(`user:${user.id}:categories`) || [];
    
    const index = categories.findIndex((cat: any) => cat.id === id);
    if (index === -1) {
      return c.json({ error: 'Category not found' }, 404);
    }
    
    // Check if there are transactions using this category
    const transactions = await kv.get(`user:${user.id}:transactions`) || [];
    const hasTransactions = transactions.some((t: any) => t.categoryId === id);
    
    if (hasTransactions) {
      return c.json({ error: 'Cannot delete category with existing transactions' }, 400);
    }
    
    categories.splice(index, 1);
    await kv.set(`user:${user.id}:categories`, categories);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting category: ${error.message}`);
    return c.json({ error: 'Failed to delete category' }, 500);
  }
});

// ==================== PROFILE ROUTES ====================

app.get("/make-server-638221b2/profile", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const profile = await kv.get(`user:${user.id}:profile`) || { currency: 'USD' };
    return c.json({ 
      profile: {
        ...profile,
        email: user.email,
        name: user.user_metadata?.name || '',
      }
    });
  } catch (error) {
    console.log(`Error fetching profile: ${error.message}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.put("/make-server-638221b2/profile", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const updates = await c.req.json();
    const profile = await kv.get(`user:${user.id}:profile`) || {};
    
    const updatedProfile = { ...profile, ...updates };
    await kv.set(`user:${user.id}:profile`, updatedProfile);
    
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log(`Error updating profile: ${error.message}`);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ==================== ANALYTICS/REPORTS ROUTES ====================

app.get("/make-server-638221b2/analytics", async (c) => {
  const user = await getAuthenticatedUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const transactions = await kv.get(`user:${user.id}:transactions`) || [];
    const budgets = await kv.get(`user:${user.id}:budgets`) || [];
    const categories = await kv.get(`user:${user.id}:categories`) || [];
    
    // Calculate spending by category
    const categorySpending: any = {};
    transactions.forEach((t: any) => {
      if (t.type === 'expense') {
        categorySpending[t.categoryId] = (categorySpending[t.categoryId] || 0) + t.amount;
      }
    });
    
    // Calculate spending over time (last 6 months)
    const now = new Date();
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthTransactions = transactions.filter((t: any) => {
        const tDate = new Date(t.date);
        return tDate >= month && tDate <= monthEnd;
      });
      
      const income = monthTransactions
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      
      monthlyData.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income,
        expenses,
      });
    }
    
    return c.json({
      categorySpending,
      monthlyData,
      categories,
      budgets,
      transactions,
    });
  } catch (error) {
    console.log(`Error fetching analytics: ${error.message}`);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

Deno.serve(app.fetch);
