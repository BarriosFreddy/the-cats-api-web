import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timeout?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  
  constructor() {}
  
  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }
  
  success(message: string, timeout: number = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.SUCCESS,
      timeout
    });
  }
  
  error(message: string, timeout: number = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.ERROR,
      timeout
    });
  }
  
  warning(message: string, timeout: number = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.WARNING,
      timeout
    });
  }
  
  info(message: string, timeout: number = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.INFO,
      timeout
    });
  }
  
  removeNotification(id: string): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.filter(notification => notification.id !== id);
    this.notifications.next(updatedNotifications);
  }
  
  private addNotification(notification: Notification): void {
    const currentNotifications = this.notifications.getValue();
    this.notifications.next([...currentNotifications, notification]);
    
    if (notification.timeout) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.timeout);
    }
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
