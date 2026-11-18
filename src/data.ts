export type Transaction = {
  id: number
  name: string
  detail: string
  date: string
  amount: number
  kind: 'income' | 'expense'
  category: string
  symbol: string
}

export const initialTransactions: Transaction[] = [
  { id: 1, name: 'Spotify', detail: 'Subscription', date: 'Today, 10:42 AM', amount: 10.99, kind: 'expense', category: 'Entertainment', symbol: 'S' },
  { id: 2, name: 'Salary deposit', detail: 'Monthly income', date: 'Today, 9:15 AM', amount: 2450, kind: 'income', category: 'Income', symbol: '↙' },
  { id: 3, name: 'Whole Foods', detail: 'Groceries', date: 'Yesterday, 6:30 PM', amount: 86.42, kind: 'expense', category: 'Shopping', symbol: 'W' },
  { id: 4, name: 'Transfer from Alex', detail: 'Personal transfer', date: 'Yesterday, 1:08 PM', amount: 120, kind: 'income', category: 'Transfer', symbol: 'A' },
  { id: 5, name: 'Uber', detail: 'Ride', date: 'Nov 15, 8:20 PM', amount: 18.5, kind: 'expense', category: 'Transport', symbol: 'U' },
]

export const initialAssets = [
  { name: 'Bitcoin', ticker: 'BTC', amount: 0.0842, value: 5684.22, change: 2.41, color: '#e8a23b', icon: '₿' },
  { name: 'Ethereum', ticker: 'ETH', amount: 1.42, value: 4821.6, change: -0.82, color: '#7885a7', icon: '◆' },
  { name: 'Solana', ticker: 'SOL', amount: 18.5, value: 3482.75, change: 5.16, color: '#8b83b8', icon: '◎' },
]

export const chartValues = [32, 38, 34, 47, 43, 51, 45, 57, 52, 62, 56, 70, 64, 77, 72, 83, 76, 91, 85, 96, 89, 100, 93, 108]
