import { Wallet } from '../../../shared/types';

export const mockCustomerWallet: Wallet = {
  id: 'WAL-001',
  userId: 'CUST-001',
  totalPoints: 1250,
  cashEquivalent: 2500,
  transactions: [
    {
      id: 'TXN-101',
      type: 'credit',
      amount: 1600,
      points: 800,
      description: 'Recycling Reward: Metals & Glass',
      date: '2026-08-02',
      status: 'completed',
      pickupId: 'PU-8820'
    },
    {
      id: 'TXN-102',
      type: 'debit',
      amount: 500,
      points: 250,
      description: 'Redeemed: LKR 500 Supermarket Voucher',
      date: '2026-08-04',
      status: 'completed',
      rewardId: 'REW-01'
    }
  ]
};
