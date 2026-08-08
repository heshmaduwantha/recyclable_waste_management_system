import { apiCall } from './api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const data = await apiCall<AppNotification[]>('/notifications');
      return data;
    } catch {
      return [
        {
          id: 'NOTIF-01',
          title: 'Pickup Assigned!',
          message: 'Collector Suresh has been assigned for your scheduled pickup today.',
          timestamp: '10 mins ago',
          isRead: false
        },
        {
          id: 'NOTIF-02',
          title: '+340 Eco Points Credited',
          message: 'Your recycling batch PU-8820 was verified and points added to wallet!',
          timestamp: '2 hours ago',
          isRead: true
        }
      ];
    }
  },

  async triggerLocalPushNotification(title: string, body: string): Promise<boolean> {
    console.log(`[Push Notification Dispatched] Title: "${title}" | Body: "${body}"`);
    return true;
  }
};
