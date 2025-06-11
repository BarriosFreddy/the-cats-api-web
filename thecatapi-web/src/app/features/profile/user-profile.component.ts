import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeftIcon, AlertTriangleIcon } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { AuthApiService } from '../../core/infrastructure/services/auth-api.service';
import { of, catchError, tap, finalize, Subscription, BehaviorSubject } from 'rxjs';
import { User } from '../../core/domain/entities/user.entity';

interface MongoUser extends User {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  readonly ArrowLeftIcon = ArrowLeftIcon;
  readonly AlertTriangleIcon = AlertTriangleIcon;
  
  private userSubject = new BehaviorSubject<MongoUser | null>(null);
  user$ = this.userSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string>('');
  error$ = this.errorSubject.asObservable();
  
  get loading(): boolean {
    return this.loadingSubject.value;
  }
  
  set loading(value: boolean) {
    this.loadingSubject.next(value);
  }
  
  get error(): string {
    return this.errorSubject.value;
  }
  
  set error(value: string) {
    this.errorSubject.next(value);
  }
  
  private subscription = new Subscription();
  private authService = inject(AuthApiService);

  ngOnInit(): void {
    this.loading = true;
    this.error = '';
    
    const sub = this.authService.getCurrentUser().pipe(
      tap(user => {
        if (!user) {
          throw new Error('User not found');
        }
      }),
      catchError(err => {
        this.error = err.message || 'Failed to fetch user profile';
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(user => {
      this.userSubject.next(user);
    });
    
    this.subscription.add(sub);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
