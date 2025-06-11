import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification, NotificationService, NotificationType } from '../../../core/infrastructure/services/notification.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [
    trigger('notificationAnimation', [
      state('void', style({ 
        transform: 'translateY(-20px)',
        opacity: 0 
      })),
      state('visible', style({ 
        transform: 'translateY(0)',
        opacity: 1 
      })),
      transition('void => visible', animate('300ms ease-in')),
      transition('visible => void', animate('300ms ease-out')),
    ])
  ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription | null = null;
  
  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.getNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  dismiss(notification: Notification): void {
    this.notificationService.removeNotification(notification.id);
  }

  getNotificationClass(type: NotificationType): string {
    switch(type) {
      case NotificationType.SUCCESS:
        return 'notification-success';
      case NotificationType.ERROR:
        return 'notification-error';
      case NotificationType.WARNING:
        return 'notification-warning';
      case NotificationType.INFO:
        return 'notification-info';
      default:
        return '';
    }
  }

  getNotificationIcon(type: NotificationType): string {
    switch(type) {
      case NotificationType.SUCCESS:
        return '✓';
      case NotificationType.ERROR:
        return '✕';
      case NotificationType.WARNING:
        return '⚠';
      case NotificationType.INFO:
        return 'ℹ';
      default:
        return '';
    }
  }
}
