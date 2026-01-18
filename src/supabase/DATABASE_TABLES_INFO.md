# Momentum Database Tables Documentation

This document describes all the database tables created for the Momentum expense tracker application.

## Database Schema Overview

The Momentum application uses **5 main tables** to store all financial and user data:

### 1. 📋 user_profiles
**Purpose**: Stores detailed user account information and preferences

**Key Fields**:
- `id` - Unique profile identifier (UUID)
- `user_id` - References auth.users (the actual Supabase auth user)
- `full_name` - User's full name
- `email` - User's email address
- `phone_number` - Contact number
- `date_of_birth` - User's birthday
- `country` - User's country
- `currency` - Preferred currency (default: 'INR')
- `timezone` - User's timezone
- `preferred_language` - UI language preference
- `avatar_url` - Profile picture URL
- `monthly_income` - User's monthly income
- `financial_goals` - User's financial objectives
- `risk_tolerance` - Investment risk preference (conservative/moderate/aggressive)
- Notification preferences (email, push, weekly summary, budget alerts)
- Timestamps (created_at, updated_at, last_login)

**Security**: Row Level Security (RLS) enabled - users can only access their own profile

---

### 2. 💰 financial_history
**Purpose**: Comprehensive tracking of ALL financial activities and transactions

**Key Fields**:
- `id` - Unique transaction identifier
- `user_id` - Owner of the transaction
- `transaction_type` - Type: income, expense, transfer, investment, refund
- `amount` - Transaction amount
- `currency` - Transaction currency
- `category_id` - Link to categories table
- `category_name` - Category name
- `category_emoji` - Visual emoji for category
- `subcategory` - More specific categorization
- `account_id` - Which account this transaction belongs to
- `account_name` - Account name
- `account_type` - Type of account
- `description` - Transaction description
- `merchant_name` - Who was paid/received from
- `merchant_location` - Where transaction occurred
- `payment_method` - cash, credit_card, debit_card, bank_transfer, upi, wallet, other
- `receipt_url` - Link to receipt image
- `receipt_thumbnail` - Thumbnail of receipt
- `has_receipt` - Boolean flag
- `transaction_date` - When transaction occurred
- `budget_id` - Associated budget (if any)
- `is_recurring` - Is this a recurring transaction
- `recurring_frequency` - How often it recurs
- `tags` - Array of tags for filtering
- `notes` - Additional notes
- `status` - pending, completed, cancelled, scheduled
- `is_deleted` - Soft delete flag
- `sentiment` - positive, neutral, negative (for analytics)
- `is_necessary` - Was this a necessary expense
- `source` - manual, import, automatic, ai_parsed
- `metadata` - Additional JSON data

**Indexes**: Optimized for queries on user_id, transaction_date, category, type, account, tags, and status

**Security**: RLS enabled - users can only access their own transactions

---

### 3. 🏦 accounts
**Purpose**: Manages user's financial accounts (bank accounts, credit cards, wallets, etc.)

**Key Fields**:
- `id` - Unique account identifier
- `user_id` - Owner of the account
- `name` - Account name (e.g., "Chase Checking")
- `account_type` - checking, savings, current, investment, credit_card, wallet, other
- `balance` - Current balance
- `currency` - Account currency
- `institution_name` - Bank or financial institution
- `account_number_last4` - Last 4 digits of account number
- `color` - UI color for the account
- `icon` - Icon identifier
- `is_active` - Is account currently active
- Timestamps (created_at, updated_at)

**Security**: RLS enabled - users can only access their own accounts

---

### 4. 📁 categories
**Purpose**: Organizes transactions into categories with emojis and colors

**Key Fields**:
- `id` - Unique category identifier
- `user_id` - Owner (custom categories)
- `name` - Category name (e.g., "Food & Dining")
- `category_type` - income or expense
- `emoji` - Visual emoji (e.g., 🍔)
- `color` - UI color code
- `icon` - Icon identifier
- `parent_category_id` - For subcategories
- `is_system` - System vs user-created category
- Timestamps (created_at, updated_at)

**Unique Constraint**: One category name per type per user

**Security**: RLS enabled - users can only access their own categories

---

### 5. 💵 budgets
**Purpose**: Track spending limits and budget goals

**Key Fields**:
- `id` - Unique budget identifier
- `user_id` - Budget owner
- `category_id` - Which category this budget applies to
- `amount` - Budget limit amount
- `period` - weekly, monthly, quarterly, yearly
- `start_date` - When budget period starts
- `end_date` - When budget period ends
- `alert_threshold` - Percentage for alerts (default: 80%)
- `is_active` - Is budget currently active
- Timestamps (created_at, updated_at)

**Security**: RLS enabled - users can only access their own budgets

---

## Database Views

### monthly_spending_summary
Aggregated view of spending by month, category, and type

### account_balance_summary
Summary of account balances and transaction counts

---

## Triggers

All tables have automatic `updated_at` triggers that update the timestamp whenever a row is modified.

---

## Data Migration

To apply these tables to your Supabase project:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the contents of `/supabase/migrations/create_tables.sql`
4. Run the SQL migration

All tables will be created with proper:
- ✅ Row Level Security policies
- ✅ Indexes for performance
- ✅ Foreign key relationships
- ✅ Data validation constraints
- ✅ Automatic timestamp updates

---

## Notes

- All monetary values use `DECIMAL(12, 2)` for precision
- UUIDs are used for all primary keys
- Cascade deletions ensure data integrity
- Timestamps are in UTC with timezone support
- All user data is isolated via RLS policies
