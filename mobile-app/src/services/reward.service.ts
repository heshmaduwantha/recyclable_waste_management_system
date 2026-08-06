import { Reward } from '../../../shared/types';

export const rewardService = {
  async getRewards(): Promise<Reward[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [
      {
        id: 'REW-DIALOG-100',
        title: 'Dialog LKR 100 Mobile Reload',
        description: 'Instant airtime reload for any Dialog mobile number (077 / 076 / 074)',
        pointsRequired: 100,
        category: 'voucher',
        partnerName: 'Dialog Axiata PLC',
        expiryDate: '2026-12-31'
      },
      {
        id: 'REW-MOBITEL-100',
        title: 'SLT-Mobitel LKR 100 Mobile Reload',
        description: 'Instant reload top-up for any SLT-Mobitel mobile number (071 / 070)',
        pointsRequired: 100,
        category: 'voucher',
        partnerName: 'SLT-Mobitel Sri Lanka',
        expiryDate: '2026-12-31'
      },
      {
        id: 'REW-DIALOG-500',
        title: 'Dialog LKR 500 Data & Voice Reload',
        description: 'LKR 500 mobile reload credit for Dialog prepaid & postpaid',
        pointsRequired: 500,
        category: 'voucher',
        partnerName: 'Dialog Axiata PLC',
        expiryDate: '2026-12-31'
      },
      {
        id: 'REW-MOBITEL-500',
        title: 'SLT-Mobitel LKR 500 Data & Voice Reload',
        description: 'LKR 500 mobile reload credit for SLT-Mobitel prepaid & postpaid',
        pointsRequired: 500,
        category: 'voucher',
        partnerName: 'SLT-Mobitel Sri Lanka',
        expiryDate: '2026-12-31'
      }
    ];
  }
};

