export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  points: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  pickupId?: string;
  rewardId?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  totalPoints: number;
  cashEquivalent: number;
  transactions: Transaction[];
}
