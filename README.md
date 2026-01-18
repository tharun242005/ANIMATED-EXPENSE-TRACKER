# Animated Expense Tracker

Animated Expense Tracker (Momentum) is a React + TypeScript web application for intelligent personal finance management. It helps users track expenses, manage budgets, monitor multiple accounts, and visualize spending patterns with beautiful animations and data visualizations. The platform features real-time transaction tracking, receipt management, subscription monitoring, comprehensive reporting, and AI-generated financial tips.

---

## Live App

**Production URL**: [https://animated-expense-tracker.web.app/](https://animated-expense-tracker.web.app/)

The application is deployed on Firebase Hosting and uses Supabase for backend services.

---

## Tech Stack

- **React + TypeScript** (frontend UI with componentized architecture)
- **Vite** (fast development server and optimized builds)
- **Supabase** (authentication, database, and edge functions for backend)
- **Framer Motion** (`motion` for smooth UI animations and transitions)
- **Tailwind CSS** (utility-first responsive styling)
- **Radix UI** (accessible component primitives)
- **Recharts** (interactive data visualization and charts)
- **React Hook Form** (form validation and management)
- **Day.js** (date/time utilities)
- **Firebase Hosting** (static site deployment)

---

## Features

### Core Functionality

- **Transaction Tracking** – Comprehensive expense and income management with categories, accounts, and tags
- **Multi-Account Management** – Support for checking, savings, credit cards, investment accounts, digital wallets, and cash
- **Budget Management** – Set and track budgets by category with alerts and progress visualization
- **Category System** – Emoji-enhanced categories with custom organization and hierarchical support
- **Receipt Management** – Upload and store receipts with future OCR integration support
- **Subscription Tracker** – Monitor recurring subscriptions and payments
- **Financial Reports** – Detailed analytics with charts, spending trends, and category breakdowns
- **Financial Tips** – AI-generated financial advice and best practices
- **Profile Management** – User profiles with preferences, currency settings, and financial goals

### UI/UX Features

- **Animated Dashboard** – Beautiful animations using Framer Motion with smooth transitions
- **Interactive Charts** – Pie charts, line graphs, and bar charts for spending visualization
- **Color-Coded Categories** – Visual indicators with emojis for quick identification
- **Warm Theme** – Professional beige/brown color scheme with light and dark mode support
- **Responsive Design** – Mobile-first design that adapts to all screen sizes
- **Real-Time Updates** – Instant UI updates when adding or modifying transactions
- **Loading States** – Animated loaders for better user experience
- **Toast Notifications** – User feedback via Sonner toast notifications

### Data Visualization

- **Spending Overview** – Monthly income vs expenses with trend indicators
- **Category Breakdown** – Pie charts showing spending distribution by category
- **Account Balances** – Visual representation of total balances across all accounts
- **Budget Progress** – Progress bars and visual indicators for budget tracking
- **Transaction History** – Comprehensive transaction list with filtering and sorting

---

## Getting Started

### Prerequisites

- **Node.js LTS** (v18 or higher recommended) and npm installed:

```bash
node -v
npm -v
```

- **Supabase Account** – Sign up at [supabase.com](https://supabase.com) for backend services

### Installation

1. **Clone the repository** or navigate to the project directory:

```bash
cd "Animated Expense Tracker"
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up Supabase configuration:**

   - Create a `.env` file in the `src` directory (if needed for local Supabase client config)
   - Configure your Supabase project ID and keys in `src/utils/supabase/info.tsx`

   **Note:** The application uses Supabase for authentication, database, and edge functions. Configure your Supabase project settings accordingly.

4. **Start the development server:**

```bash
npm run dev
```

Vite will start the development server (typically on `http://localhost:3000` based on `vite.config.ts`). Open it in your browser.

5. **Build for production:**

```bash
npm run build
```

The build output will be in the `build/` directory, ready for Firebase Hosting deployment.

---

## Environment Variables

If you need to configure Supabase client locally, update `src/utils/supabase/info.tsx` with your Supabase project details:

```typescript
export const projectId = "your-project-id";
export const publicAnonKey = "your-anon-key";
```

**Security Notes:**
- Never commit actual keys to version control
- Use environment variables or secure configuration for sensitive data
- Restrict API keys appropriately in Supabase dashboard

---

## Project Structure

```
Animated Expense Tracker/
├──DATABASE
├──SCHEMA.png
├── src/
│   ├── App.tsx                      # Main application component and routing
│   ├── main.tsx                     # React entry point
│   ├── index.css                    # Global styles
│   ├── components/
│   │   ├── auth-context.tsx         # Authentication context provider
│   │   ├── landing-page.tsx         # Landing page with hero section
│   │   ├── login.tsx                # User login component
│   │   ├── signup.tsx               # User registration component
│   │   ├── layout.tsx               # Main layout with navigation
│   │   ├── dashboard.tsx            # Dashboard with stats and charts
│   │   ├── transactions-page.tsx    # Transaction list and management
│   │   ├── add-transaction-form.tsx # Transaction creation form
│   │   ├── budgets-page.tsx         # Budget management interface
│   │   ├── accounts-page.tsx        # Account management
│   │   ├── categories-page.tsx      # Category organization
│   │   ├── reports-page.tsx         # Financial reports and analytics
│   │   ├── profile-page.tsx         # User profile settings
│   │   ├── receipt-manager.tsx      # Receipt upload and management
│   │   ├── subscription-tracker.tsx # Subscription monitoring
│   │   ├── financial-tip.tsx        # Financial tips component
│   │   ├── animated-loader.tsx      # Loading animation component
│   │   ├── demo-page.tsx            # Demo mode page
│   │   ├── privacy-policy.tsx       # Privacy policy page
│   │   ├── terms-of-service.tsx     # Terms of service page
│   │   └── ui/                      # Reusable UI components (Radix UI)
│   ├── utils/
│   │   ├── category-emojis.tsx      # Category emoji mapping utility
│   │   └── supabase/
│   │       ├── client.tsx           # Supabase client configuration
│   │       └── info.tsx             # Supabase project configuration
│   ├── styles/
│   │   └── globals.css              # Global styles and warm theme
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── create_tables.sql    # Database schema migration
│   │   ├── functions/
│   │   │   └── server/
│   │   │       ├── index.tsx        # Supabase Edge Functions server
│   │   │       └── kv_store.tsx     # Key-value store implementation
│   │   ├── DATABASE_SETUP.md        # Database setup guide
│   │   └── DATABASE_TABLES_INFO.md  # Database schema documentation
│   ├── IMPLEMENTATION_SUMMARY.md    # Feature implementation details
│   ├── NEW_FEATURES.md              # Recent features documentation
│   └── UPDATES.md                   # Update changelog
├── build/                            # Production build output
├── node_modules/                     # Dependencies
├── package.json                      # Project dependencies and scripts
├── vite.config.ts                    # Vite configuration
├── firebase.json                     # Firebase Hosting configuration
└── README.md                         # This file
```

---

## Key Features Deep Dive

### Transaction Management

- **Multiple Transaction Types** – Income, expense, transfer, investment, refund
- **Rich Metadata** – Categories, accounts, merchants, payment methods, tags
- **Date Tracking** – Full date and time support with filtering
- **Status Management** – Pending, completed, cancelled, scheduled
- **Receipt Attachment** – Link receipts to transactions for future OCR processing

### Account Types

Support for various financial account types:
- **Checking Account** – Primary bank account
- **Savings Account** – Savings deposits
- **Current Account** – Business/current accounts
- **Credit Card** – Credit card tracking
- **Investment Account** – Investment portfolio
- **Digital Wallet** – UPI, digital wallets
- **Cash** – Physical cash tracking

### Budget System

- **Category-Based Budgets** – Set budgets per category
- **Flexible Periods** – Weekly, monthly, quarterly, yearly
- **Progress Tracking** – Visual progress bars and percentage indicators
- **Alert Thresholds** – Notifications when approaching budget limits
- **Active/Inactive Status** – Enable or disable budgets as needed

### Category System

- **Emoji Support** – 30+ predefined category-emoji mappings
- **Hierarchical Categories** – Parent-child category relationships
- **Custom Categories** – User-defined categories with emojis and colors
- **Type Organization** – Separate income and expense categories
- **Visual Identification** – Color-coded categories for quick recognition

### Reports & Analytics

- **Spending Trends** – Monthly and yearly spending analysis
- **Category Breakdown** – Visual charts showing spending by category
- **Account Summary** – Balance and transaction summaries per account
- **Income vs Expenses** – Comparative analysis with charts
- **Date Range Filtering** – Custom date range reports

### Receipt Management

- **Drag & Drop Upload** – Easy receipt image upload
- **Image Preview** – Full preview before saving
- **File Validation** – Size and format validation
- **Future OCR Integration** – Ready for automatic data extraction

---

## Database Schema

The application uses Supabase PostgreSQL with the following main tables:

### Core Tables

1. **user_profiles** – User account information and preferences
2. **financial_history** – All financial transactions with comprehensive metadata
3. **accounts** – User financial accounts (checking, savings, etc.)
4. **categories** – Transaction categories with emoji support
5. **budgets** – Budget definitions and tracking

### Security

- **Row Level Security (RLS)** – Enabled on all tables
- **User Isolation** – Users can only access their own data
- **Authentication** – Supabase Auth integration
- **Secure API** – Edge Functions with authentication

For detailed database setup, see `src/supabase/DATABASE_SETUP.md`.

---

## Scripts

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR on port 3000 |
| `npm run build` | Create optimized production bundle in `build/` |

---

## Deployment

### Firebase Hosting

The application is configured for Firebase Hosting deployment:

1. **Install Firebase CLI:**

```bash
npm install -g firebase-tools
```

2. **Login to Firebase:**

```bash
firebase login
```

3. **Build the project:**

```bash
npm run build
```

4. **Deploy to Firebase:**

```bash
firebase deploy --only hosting
```

The `firebase.json` configuration file is already set up with:
- Public directory: `build`
- SPA routing: All routes rewrite to `index.html`

### Alternative Deployment Options

- **Netlify** – Connect GitHub repo or use Netlify CLI
- **Vercel** – Framework preset: Vite, output directory: `build`
- **Cloudflare Pages** – Build command: `npm run build`, output directory: `build`

---

## Browser Compatibility

- **Chrome/Edge** (recommended) – Full support
- **Firefox** – Full support
- **Safari** – Full support
- **Mobile Browsers** – Responsive design works on tablets and phones

---

## Performance Considerations

- **Code Splitting** – Automatic code splitting via Vite
- **Tree Shaking** – Unused code elimination
- **Optimized Animations** – GPU-accelerated animations with Framer Motion
- **Lazy Loading** – Images and components loaded on demand
- **Database Indexing** – Optimized Supabase queries with proper indexes
- **Bundle Size** – Minified and compressed production builds

---

## Troubleshooting

### Common Issues

**Supabase connection errors:**
- Verify Supabase project ID and keys in `src/utils/supabase/info.tsx`
- Check Supabase project is active and properly configured
- Ensure Edge Functions are deployed if using server endpoints

**Build errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Ensure Node.js version is LTS (v18+)
- Check for TypeScript errors: Review build output

**Authentication issues:**
- Verify Supabase Auth is enabled in your project
- Check authentication policies in Supabase dashboard
- Ensure RLS policies are correctly configured

**Styling issues:**
- Verify Tailwind CSS is properly configured
- Check that `index.css` imports Tailwind directives
- Clear browser cache if styles aren't updating

---

## Contributing

We welcome contributions! Here are some guidelines:

1. **Open issues** with clear reproduction steps and environment information
2. **Submit PRs** following existing code style and structure
3. **Test thoroughly** before submitting, especially financial calculations
4. **Update documentation** if adding new features or changing behavior

---

## License

This project is proprietary software. All rights reserved.

For licensing inquiries, please contact the project maintainer.

---

## Acknowledgments

- **Supabase** – For providing powerful backend infrastructure
- **React Team** – For the powerful frontend framework
- **Framer Motion** – For smooth, performant animations
- **Tailwind CSS** – For rapid, maintainable styling
- **Radix UI** – For accessible component primitives
- **Recharts** – For beautiful data visualizations

---

## Contact & Support

- **Live App**: [https://animated-expense-tracker.web.app/](https://animated-expense-tracker.web.app/)

---

## References

- [Vite Documentation](https://vite.dev/guide/) – Getting Started with Vite
- [React Documentation](https://react.dev/) – Learn React
- [Supabase Documentation](https://supabase.com/docs) – Supabase Guide
- [Framer Motion Documentation](https://www.framer.com/motion/) – Animation Library
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) – Styling Framework
- [Radix UI Documentation](https://www.radix-ui.com/) – UI Components
- [Recharts Documentation](https://recharts.org/) – Chart Library

---

**Built by [THARUN P](https://www.linkedin.com/in/tharun-p-4146b4318/) from (https://github.com/tharun242005)**

© 2025 Animated Expense Tracker. All rights reserved.
