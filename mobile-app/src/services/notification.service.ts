export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    await new Promise(res => setTimeout(res, 300));
    return [
      {
        id: 'NOTIF-01',
        title: 'Pickup Assigned!',
        message: 'Collector Nuwan has been assigned for your scheduled pickup today.',
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
  },

  /**
   * Dispatch local push notification alert
   */
  async triggerLocalPushNotification(title: string, body: string): Promise<boolean> {
    console.log(`[Push Notification Dispatched] Title: "${title}" | Body: "${body}"`);
    return true;
  }
};

