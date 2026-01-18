-- ================================================
-- Momentum Expense Tracker Database Schema
-- ================================================
-- This file contains SQL migrations to create tables for:
-- 1. User profiles and account details
-- 2. Financial history tracking
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- USER PROFILES TABLE
-- ================================================
-- Stores detailed user account information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone_number TEXT,
  date_of_birth DATE,
  country TEXT,
  currency TEXT DEFAULT 'USD',
  timezone TEXT,
  preferred_language TEXT DEFAULT 'en',
  avatar_url TEXT,
  
  -- Financial preferences
  monthly_income DECIMAL(12, 2),
  financial_goals TEXT,
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  weekly_summary BOOLEAN DEFAULT true,
  budget_alerts BOOLEAN DEFAULT true,
  
  -- Account metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Ensure one profile per user
  UNIQUE(user_id)
);

-- Index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- ================================================
-- FINANCIAL HISTORY TABLE
-- ================================================
-- Comprehensive tracking of all financial activities
CREATE TABLE IF NOT EXISTS financial_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction details
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer', 'investment', 'refund')),
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Categorization
  category_id UUID,
  category_name TEXT,
  category_emoji TEXT,
  subcategory TEXT,
  
  -- Account information
  account_id UUID,
  account_name TEXT,
  account_type TEXT,
  
  -- Transaction metadata
  description TEXT,
  merchant_name TEXT,
  merchant_location TEXT,
  payment_method TEXT CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'bank_transfer', 'upi', 'wallet', 'other')),
  
  -- Receipt information
  receipt_url TEXT,
  receipt_thumbnail TEXT,
  has_receipt BOOLEAN DEFAULT false,
  
  -- Dates
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Budget tracking
  budget_id UUID,
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  
  -- Tags and notes
  tags TEXT[],
  notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'scheduled')),
  is_deleted BOOLEAN DEFAULT false,
  
  -- Analytics
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  is_necessary BOOLEAN,
  
  -- Metadata
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'import', 'automatic', 'ai_parsed')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_financial_history_user_id ON financial_history(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_history_transaction_date ON financial_history(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_financial_history_category ON financial_history(category_id);
CREATE INDEX IF NOT EXISTS idx_financial_history_type ON financial_history(transaction_type);
CREATE INDEX IF NOT EXISTS idx_financial_history_account ON financial_history(account_id);
CREATE INDEX IF NOT EXISTS idx_financial_history_tags ON financial_history USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_financial_history_status ON financial_history(status) WHERE is_deleted = false;

-- ================================================
-- ACCOUNTS TABLE (Enhanced)
-- ================================================
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'current', 'investment', 'credit_card', 'wallet', 'other')),
  balance DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  institution_name TEXT,
  account_number_last4 TEXT,
  color TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- ================================================
-- CATEGORIES TABLE (Enhanced)
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category_type TEXT NOT NULL CHECK (category_type IN ('income', 'expense')),
  emoji TEXT,
  color TEXT,
  icon TEXT,
  parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name, category_type)
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(category_type);

-- ================================================
-- BUDGETS TABLE (Enhanced)
-- ================================================
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  alert_threshold DECIMAL(5, 2) DEFAULT 80.00, -- Percentage
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category_id);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_history_updated_at BEFORE UPDATE ON financial_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Financial History Policies
CREATE POLICY "Users can view own financial history" ON financial_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial history" ON financial_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial history" ON financial_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial history" ON financial_history
  FOR DELETE USING (auth.uid() = user_id);

-- Accounts Policies
CREATE POLICY "Users can view own accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Categories Policies
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Budgets Policies
CREATE POLICY "Users can view own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- HELPER VIEWS
-- ================================================

-- View for monthly spending summary
CREATE OR REPLACE VIEW monthly_spending_summary AS
SELECT 
  user_id,
  DATE_TRUNC('month', transaction_date) as month,
  category_name,
  transaction_type,
  SUM(amount) as total_amount,
  COUNT(*) as transaction_count
FROM financial_history
WHERE is_deleted = false
GROUP BY user_id, DATE_TRUNC('month', transaction_date), category_name, transaction_type;

-- View for account balances
CREATE OR REPLACE VIEW account_balance_summary AS
SELECT 
  a.user_id,
  a.id as account_id,
  a.name as account_name,
  a.account_type,
  a.balance,
  COUNT(fh.id) as transaction_count
FROM accounts a
LEFT JOIN financial_history fh ON a.id = fh.account_id
WHERE a.is_active = true
GROUP BY a.id, a.user_id, a.name, a.account_type, a.balance;
