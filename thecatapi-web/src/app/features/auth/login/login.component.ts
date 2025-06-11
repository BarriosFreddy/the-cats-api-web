import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginUseCase } from '../../../core/application/use-cases/auth/login.use-case';
import { LoginCredentials } from '../../../core/domain/entities/auth.entity';
import { NotificationService } from '../../../core/infrastructure/services/notification.service';
import { LucideAngularModule, CatIcon, XCircleIcon, LockIcon, LoaderIcon } from 'lucide-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule]
})
export class LoginComponent {
  readonly CatIcon = CatIcon;
  readonly XCircleIcon = XCircleIcon;
  readonly LockIcon = LockIcon;
  readonly LoaderIcon = LoaderIcon;
  
  loginForm: FormGroup;
  errorMessage: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private loginUseCase: LoginUseCase,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const credentials: LoginCredentials = this.loginForm.value;

      this.loginUseCase.execute(credentials)
        .subscribe({
          next: (response) => {
            console.log('Login successful', response);
            if (response && response.user && response.token) {
              localStorage.setItem('currentUser', JSON.stringify(response.user));
              localStorage.setItem('token', response.token);
              window.location.href = '/home';
              this.notificationService.success(`Welcome back, ${response.user.name}!`);
              this.isSubmitting = false;
            } else {
              console.error('Invalid login response structure:', response);
              this.notificationService.error('Invalid login response from server');
            }
          },
          error: (error) => {
            console.error('Login failed', error);
            this.isSubmitting = false;
            this.errorMessage = error?.error?.message || 'Invalid email or password. Please try again.';
            this.notificationService.error(this.errorMessage);
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
      this.notificationService.warning('Please fill out all required fields correctly.');
    }
  }
}
