export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: 'voucher' | 'cashback' | 'eco_product' | 'donation';
  partnerName: string;
  partnerLogo?: string;
  expiryDate: string;
  code?: string;
  isRedeemed?: boolean;
}
