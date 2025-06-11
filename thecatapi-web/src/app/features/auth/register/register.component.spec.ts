import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { CreateUserUseCase } from '../../../core/application/use-cases/user/create-user.use-case';
import { NotificationService } from '../../../core/infrastructure/services/notification.service';
import { of, throwError } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { User } from '../../../core/domain/entities/user.entity';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let createUserUseCaseSpy: jasmine.SpyObj<CreateUserUseCase>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  beforeEach(async () => {
    createUserUseCaseSpy = jasmine.createSpyObj('CreateUserUseCase', ['execute']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, 
        RouterTestingModule.withRoutes([
          { path: 'login', component: {} as any },
          { path: 'register', component: RegisterComponent },
        ]),
        LucideAngularModule,
        RegisterComponent
      ],
      providers: [
        { provide: CreateUserUseCase, useValue: createUserUseCaseSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should have form invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate name field as required', () => {
    const name = component.registerForm.get('name');
    name?.setValue('');
    expect(name?.valid).toBeFalsy();
    expect(name?.errors?.['required']).toBeTruthy();
    
    name?.setValue('Test User');
    expect(name?.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const email = component.registerForm.get('email');
    email?.setValue('invalid-email');
    expect(email?.valid).toBeFalsy();
    expect(email?.errors?.['email']).toBeTruthy();
    
    email?.setValue('valid@example.com');
    expect(email?.valid).toBeTruthy();
  });

  it('should validate password strength', () => {
    const password = component.registerForm.get('password');
    password?.setValue('weak');
    expect(password?.valid).toBeFalsy();
    expect(password?.errors?.['minlength']).toBeTruthy();
    
    password?.setValue('StrongPassword123');
    expect(password?.valid).toBeTruthy();
  });

  it('should validate password confirmation match', () => {
    const password = component.registerForm.get('password');
    const confirmPassword = component.registerForm.get('confirmPassword');
    
    password?.setValue('StrongPassword123');
    confirmPassword?.setValue('DifferentPassword123');
    
    // Trigger form validation
    component.registerForm.updateValueAndValidity();
    
    expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();
    
    confirmPassword?.setValue('StrongPassword123');
    component.registerForm.updateValueAndValidity();
    
    expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should display Lucide icons correctly', () => {
    fixture.detectChanges();
    const iconElements = fixture.debugElement.queryAll(By.css('lucide-icon'));
    expect(iconElements.length).toBeGreaterThan(0);
  });

  it('should show error message when registration fails', () => {
    const error = new Error('Email already exists');
    createUserUseCaseSpy.execute.and.returnValue(throwError(() => error));
    
    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    });
    
    component.onSubmit();
    fixture.detectChanges();
    
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  it('should navigate to home on successful registration', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    };
    
    component.registerForm.setValue(userData);
    
    const userMock: User = {
      id: '123',
      name: userData.name,
      email: userData.email
    };

    createUserUseCaseSpy.execute.and.returnValue(of(userMock));
    
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.onSubmit();

    expect(createUserUseCaseSpy.execute).toHaveBeenCalledWith({
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    
    expect(notificationServiceSpy.success).toHaveBeenCalledWith('¡Registro exitoso! Bienvenido a The Cat API.');
    expect(navigateSpy).toHaveBeenCalledWith(['/home'], jasmine.objectContaining({replaceUrl: true}));
  });

  it('should have responsive design elements', () => {
    // Test for responsive container
    const container = fixture.debugElement.query(By.css('.min-h-screen'));
    expect(container.nativeElement.classList.contains('py-6')).toBeTruthy();
    expect(container.nativeElement.classList.contains('px-3')).toBeTruthy();
    expect(container.nativeElement.classList.contains('sm:py-12')).toBeTruthy();
    
    // Test for responsive card
    const card = fixture.debugElement.query(By.css('.max-w-md'));
    expect(card.nativeElement.classList.contains('p-4')).toBeTruthy();
    expect(card.nativeElement.classList.contains('sm:p-8')).toBeTruthy();
    
    // Test for responsive button
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.classList.contains('py-2')).toBeTruthy();
    expect(button.nativeElement.classList.contains('sm:py-3')).toBeTruthy();
  });
});
