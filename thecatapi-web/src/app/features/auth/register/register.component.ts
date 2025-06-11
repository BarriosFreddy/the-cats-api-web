import { Component } from '@angular/core';
import { LucideAngularModule, CatIcon, XCircleIcon, LockIcon, LoaderIcon, AlertCircleIcon } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateUserUseCase } from '../../../core/application/use-cases/user/create-user.use-case';
import { User } from '../../../core/domain/entities/user.entity';
import { AuthResponse } from '../../../core/domain/entities/auth.entity';
import { NotificationService } from '../../../core/infrastructure/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule]
})
export class RegisterComponent {
  readonly CatIcon = CatIcon;
  readonly XCircleIcon = XCircleIcon;
  readonly AlertCircleIcon = AlertCircleIcon;
  readonly LockIcon = LockIcon;
  readonly LoaderIcon = LoaderIcon;

  registerForm: FormGroup;
  errorMessage: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private createUserUseCase: CreateUserUseCase,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const { name, email, password } = this.registerForm.value;
      const user: User = { name, email, password };
      
      // Define a proper type for the response
      interface RegisterResponse {
        id?: string;
        name?: string;
        email?: string;
        token?: string;
        user?: {
          id?: string;
          name?: string;
          email?: string;
        };
      }
      
      // Cast the observable to the expected response type
      (this.createUserUseCase.execute(user) as Observable<RegisterResponse>)
        .subscribe({
          next: (response: RegisterResponse) => {
            console.log('User created successfully', response);
            this.isSubmitting = false;
            this.registerForm.reset();
            
            // Store user data in local storage if available in response
            if (response) {
              if (response.user && response.token) {
                // It's an AuthResponse-like object with user and token
                localStorage.setItem('currentUser', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);
              } else if (response.token) {
                // It has a token but user data is at the top level
                const userData = {
                  id: response.id,
                  name: response.name,
                  email: response.email
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('token', response.token);
              } else {
                // It's a User object without a token
                localStorage.setItem('currentUser', JSON.stringify(response));
                // No token available
              }
            }
            
            this.notificationService.success('¡Registro exitoso! Bienvenido a The Cat API.');
            
            // Redirect to home page after successful registration with more reliable navigation
            console.log('Navigating to home page');
            this.router.navigate(['/home'], { replaceUrl: true }).then(() => {
              console.log('Navigation complete');
            }).catch(err => {
              console.error('Navigation error:', err);
              // Fallback navigation if the first attempt fails
              window.location.href = '/home';
            });
          },
          error: (error) => {
            console.error('Registration failed', error);
            this.isSubmitting = false;
            
            // Set local error message
            this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
            
            // Show error notification
            this.notificationService.error(this.errorMessage);
          }
        });
    } else {
      this.registerForm.markAllAsTouched();
      this.notificationService.warning('Please fix the form errors before submitting.');
    }
  }
}
