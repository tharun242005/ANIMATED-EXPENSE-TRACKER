// Category emoji mappings
export const categoryEmojis: Record<string, string> = {
  // Expense categories
  'groceries': '🛒',
  'dining out': '🍽️',
  'rent': '🏠',
  'utilities': '⚡',
  'transportation': '🚗',
  'entertainment': '🎬',
  'healthcare': '❤️',
  'shopping': '🛍️',
  'coffee': '☕',
  'gas': '⛽',
  'internet': '🌐',
  'phone': '📱',
  'insurance': '🛡️',
  'education': '📚',
  'gym': '💪',
  'travel': '✈️',
  'pet': '🐾',
  'clothing': '👕',
  'beauty': '💄',
  'subscriptions': '📺',
  'gifts': '🎁',
  'charity': '❤️',
  'hobbies': '🎨',
  'taxes': '💰',
  'repairs': '🔧',
  'other': '📌',
  
  // Income categories
  'salary': '💵',
  'freelance': '💻',
  'investment': '📈',
  'business': '💼',
  'bonus': '🎉',
  'gift': '🎁',
  'refund': '↩️',
  'other income': '💸',
  'rental': '🏘️',
  'dividends': '📊',
  'interest': '🏦',
};

// Get emoji for a category name (case insensitive)
export function getCategoryEmoji(categoryName: string): string {
  const name = categoryName.toLowerCase().trim();
  return categoryEmojis[name] || '📁';
}
