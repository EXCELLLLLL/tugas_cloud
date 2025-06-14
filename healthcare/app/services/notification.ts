import { ApiService } from './api';

export type NotificationData = {
    appointmentId?: number;
    billId?: number;
    medicalRecordId?: number;
    [key: string]: unknown;
};

export interface Notification {
    id: number;
    userId: number;
    type: 'appointment' | 'bill' | 'medical_record' | 'system';
    title: string;
    message: string;
    read: boolean;
    data?: NotificationData;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNotificationInput {
    userId: number;
    type: 'appointment' | 'bill' | 'medical_record' | 'system';
    title: string;
    message: string;
    data?: NotificationData;
}

export interface UpdateNotificationInput {
    read?: boolean;
    title?: string;
    message?: string;
    data?: NotificationData;
}

class NotificationService extends ApiService {
    async getNotifications(): Promise<Notification[]> {
        return this.get<Notification[]>('/api/notifications');
    }

    async getNotification(id: number): Promise<Notification> {
        return this.get<Notification>(`/api/notifications/${id}`);
    }

    async createNotification(input: CreateNotificationInput): Promise<Notification> {
        return this.post<Notification>('/api/notifications', input);
    }

    async updateNotification(id: number, input: UpdateNotificationInput): Promise<Notification> {
        return this.put<Notification>(`/api/notifications/${id}`, input);
    }

    async deleteNotification(id: number): Promise<{ message: string }> {
        return this.delete<{ message: string }>(`/api/notifications/${id}`);
    }

    async getUserNotifications(userId: number): Promise<Notification[]> {
        return this.get<Notification[]>(`/api/notifications/user/${userId}`);
    }

    async markAsRead(id: number): Promise<Notification> {
        return this.put<Notification>(`/api/notifications/${id}/read`, { read: true });
    }

    async markAllAsRead(userId: number): Promise<{ message: string }> {
        return this.put<{ message: string }>(`/api/notifications/user/${userId}/read-all`, {});
    }

    async getUnreadCount(userId: number): Promise<{ count: number }> {
        return this.get<{ count: number }>(`/api/notifications/user/${userId}/unread-count`);
    }
}

export const notificationService = new NotificationService(); 