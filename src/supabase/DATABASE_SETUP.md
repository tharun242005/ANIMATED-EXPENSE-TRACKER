# Momentum - Supabase Database Setup Guide

This guide will help you set up the complete Supabase database schema for the Momentum expense tracker application.

## Overview

The Momentum application uses the following database tables:
- **user_profiles** - Stores comprehensive user account details and preferences
- **financial_history** - Tracks all financial transactions with detailed attributes
- **accounts** - Manages user's financial accounts (checking, savings, etc.)
- **categories** - Organizes transactions into income/expense categories with emojis
- **budgets** - Tracks spending budgets per category

## Setup Instructions

### Step 1: Connect to Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project or create a new one
3. Navigate to the **SQL Editor** from the left sidebar

### Step 2: Run the Migration

1. Open the SQL Editor in your Supabase project
2. Copy the entire contents of `/supabase/migrations/create_tables.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the migration

This will create:
- All required tables with proper schemas
- Indexes for optimal query performance
- Row Level Security (RLS) policies for data protection
- Triggers for automatic timestamp updates
- Helper views for analytics

### Step 3: Verify the Setup

After running the migration, verify that the tables were created:

```sql
-- Run this query to check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- accounts
- budgets
- categories
- financial_history
- user_profiles

### Step 4: Test the Setup

Try inserting a test record (replace `YOUR_USER_ID` with your actual auth user ID):

```sql
-- Test user profile creation
INSERT INTO user_profiles (user_id, email, full_name, currency)
VALUES ('YOUR_USER_ID', 'test@example.com', 'Test User', 'INR');

-- Test category creation
INSERT INTO categories (user_id, name, category_type, emoji, color)
VALUES ('YOUR_USER_ID', 'Groceries', 'expense', '🛒', '#10b981');
```

## Database Schema Details

### User Profiles Table
Stores comprehensive user information:
- Personal details (name, email, phone, DOB)
- Financial preferences (income, goals, risk tolerance)
- Notification settings
- Account metadata

### Financial History Table
The main transaction table with detailed tracking:
- Transaction details (type, amount, currency)
- Categorization with emoji support
- Account and merchant information
- Receipt storage support
- Recurring transaction tracking
- Tags and custom metadata
- Status and sentiment tracking

### Accounts Table
Manages multiple financial accounts:
- Multiple account types (checking, savings, investment, etc.)
- Balance tracking
- Multi-currency support
- Institution details

### Categories Table
Organizes transactions:
- Income and expense categories
- Emoji and color customization
- Hierarchical category support
- System and user-defined categories

### Budgets Table
Budget management:
- Category-based budgets
- Flexible time periods (weekly, monthly, etc.)
- Alert thresholds
- Active/inactive status

## Security Features

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Automatic user_id verification on all operations
- Secure by default

## Views and Analytics

Two helper views are included:
1. **monthly_spending_summary** - Aggregated monthly spending by category
2. **account_balance_summary** - Account balances with transaction counts

## Indexes

Optimized indexes are created for:
- User ID lookups (all tables)
- Transaction date queries
- Category and account filtering
- Tag searches (GIN index)
- Status filtering

## Migration History

- **create_tables.sql** - Initial schema creation with all tables, indexes, policies, and views

## Troubleshooting

### Issue: RLS Policies Blocking Queries
**Solution**: Make sure you're authenticated and using the correct user ID in your queries.

### Issue: Trigger Not Firing
**Solution**: Verify that the `update_updated_at_column()` function exists and is properly attached to the table.

### Issue: Cannot Insert Data
**Solution**: Check that RLS policies are correctly configured and you're passing the authenticated user's ID.

## Next Steps

After setting up the database:
1. Configure your Supabase connection in the application
2. Test authentication flow
3. Create some sample categories
4. Add test transactions
5. Verify data appears correctly in the UI

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the application's README.md
- Check the logs in Supabase Dashboard

---

**Note**: The current application uses KV store for data persistence. To fully utilize these Supabase tables, you'll need to update the server endpoints in `/supabase/functions/server/index.tsx` to use Supabase queries instead of the KV store.
