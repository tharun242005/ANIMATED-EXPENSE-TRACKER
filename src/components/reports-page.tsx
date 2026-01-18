import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from './auth-context';
import { getServerUrl } from '../utils/supabase/client';
import { PageLoader } from './animated-loader';
import { getCategoryEmoji } from '../utils/category-emojis';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export function ReportsPage() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const response = await fetch(getServerUrl('/analytics'), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  if (!analytics) {
    return <div className="p-8 text-center">Failed to load analytics</div>;
  }

  const { categorySpending, monthlyData, categories, transactions } = analytics;

  // Prepare pie chart data
  const pieData = Object.entries(categorySpending).map(([categoryId, amount]: [string, any]) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return {
      id: categoryId,
      name: category?.name || 'Unknown',
      value: amount,
      color: category?.color || '#888',
    };
  });

  const COLORS = pieData.map((d: any) => d.color);

  // Filter transactions by selected category
  const filteredTransactions = selectedCategory
    ? transactions.filter((t: any) => t.categoryId === selectedCategory)
    : [];

  // Calculate daily spending for calendar heatmap
  const dailySpending: any = {};
  transactions.forEach((t: any) => {
    if (t.type === 'expense') {
      const date = new Date(t.date).toLocaleDateString();
      dailySpending[date] = (dailySpending[date] || 0) + t.amount;
    }
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Reports
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Visualize your financial data
        </motion.p>
      </div>

      {/* Spending Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1000}
                    name="Income"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1000}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click on a slice to view transactions
              </p>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1000}
                      onClick={(data) => setSelectedCategory(data.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {pieData.map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke={selectedCategory === entry.id ? '#000' : 'none'}
                          strokeWidth={selectedCategory === entry.id ? 2 : 0}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `₹${value.toFixed(2)}`}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  No expenses to display
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Detail or Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory 
                  ? `${pieData.find((d: any) => d.id === selectedCategory)?.name} Transactions`
                  : 'Top Categories'
                }
              </CardTitle>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-primary hover:underline"
                >
                  Clear selection
                </button>
              )}
            </CardHeader>
            <CardContent>
              {selectedCategory ? (
                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction: any) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                      >
                        <div>
                          <p>{transaction.merchant || 'No merchant'}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-red-600">
                          ₹{transaction.amount.toFixed(2)}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No transactions
                    </p>
                  )}
                </div>
              ) : (
                pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={pieData.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6b7280"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value: number) => `₹${value.toFixed(2)}`}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#8b5cf6"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                      >
                        {pieData.slice(0, 5).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                    No data to display
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="income" 
                    fill="#22c55e" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    name="Income"
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="#ef4444" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    name="Expenses"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
