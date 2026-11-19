import { apiCall, apiPost } from './api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const notificationService = {
  getNotifications: () => apiCall<AppNotification[]>('/notifications'),
  markRead: (id: string) => apiPost(`/notifications/${id}/read`, undefined, 'PUT'),
  markAllRead: () => apiPost('/notifications/read-all', undefined, 'PUT'),

  async triggerLocalPushNotification(title: string, body: string): Promise<boolean> {
    console.log(`[Push Notification Dispatched] Title: "${title}" | Body: "${body}"`);
    return true;
  },
};
