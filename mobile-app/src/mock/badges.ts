import { Badge } from '../../../shared/types';

export const mockBadgesList: Badge[] = [
  {
    id: 'BADGE-01',
    name: 'Eco Starter',
    description: 'Completed your first 10kg recycling pickup',
    icon: '🌱',
    unlockedAt: '2026-07-15',
    isUnlocked: true,
    requiredRecycledKg: 10
  },
  {
    id: 'BADGE-02',
    name: 'Plastic Buster',
    description: 'Recycled over 50kg of plastic waste',
    icon: '♻️',
    unlockedAt: '2026-08-01',
    isUnlocked: true,
    requiredRecycledKg: 50
  },
  {
    id: 'BADGE-03',
    name: 'Green Guardian',
    description: 'Recycled over 100kg total waste',
    icon: '🛡️',
    isUnlocked: false,
    requiredRecycledKg: 100
  },
  {
    id: 'BADGE-04',
    name: 'Zero Waste Hero',
    description: 'Recycled over 500kg total waste',
    icon: '👑',
    isUnlocked: false,
    requiredRecycledKg: 500
  }
];
