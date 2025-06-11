import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { LoginUseCase } from '../../../core/application/use-cases/auth/login.use-case';
import { NotificationService } from '../../../core/infrastructure/services/notification.service';
import { of, throwError } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AuthResponse } from '../../../core/domain/entities/auth.entity';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginUseCaseSpy: jasmine.SpyObj<LoginUseCase>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  beforeEach(async () => {
    loginUseCaseSpy = jasmine.createSpyObj('LoginUseCase', ['execute']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, 
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
          { path: 'home', component: {} as any },
          { path: 'register', component: {} as any }
        ]),
        LucideAngularModule,
        LoginComponent
      ],
      providers: [
        { provide: LoginUseCase, useValue: loginUseCaseSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty email and password', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should have form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email field as required', () => {
    const email = component.loginForm.get('email');
    email?.setValue('');
    expect(email?.valid).toBeFalsy();
    expect(email?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const email = component.loginForm.get('email');
    email?.setValue('invalid-email');
    expect(email?.valid).toBeFalsy();
    expect(email?.errors?.['email']).toBeTruthy();
    
    email?.setValue('valid@example.com');
    expect(email?.valid).toBeTruthy();
  });

  it('should validate password field as required', () => {
    const password = component.loginForm.get('password');
    password?.setValue('');
    expect(password?.valid).toBeFalsy();
    expect(password?.errors?.['required']).toBeTruthy();
    
    password?.setValue('password123');
    expect(password?.valid).toBeTruthy();
  });

  it('should display Lucide icons correctly', () => {
    fixture.detectChanges();
    const iconElements = fixture.debugElement.queryAll(By.css('lucide-icon'));
    expect(iconElements.length).toBeGreaterThan(0);
  });

  it('should show error message when login fails', () => {
    loginUseCaseSpy.execute.and.returnValue(throwError(() => new Error('Invalid credentials')));
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    component.onSubmit();
    expect(component.errorMessage).toBeTruthy();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  it('should have proper responsive design classes', () => {
    fixture.detectChanges();
    
    // Check for responsive container classes
    const formContainer = fixture.debugElement.query(By.css('.max-w-md'));
    expect(formContainer).toBeTruthy();
    
    // Check for responsive button classes
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.classList.contains('py-3')).toBeTruthy();
    expect(submitButton.nativeElement.classList.contains('px-4')).toBeTruthy();
  });
});
