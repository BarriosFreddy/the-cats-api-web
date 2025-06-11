import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserProfileComponent } from './user-profile.component';
import { AuthApiService } from '../../core/infrastructure/services/auth-api.service';
import { UserApiService } from '../../core/infrastructure/services/user-api.service';
import { NotificationService } from '../../core/infrastructure/services/notification.service';
import { LucideAngularModule } from 'lucide-angular';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let authApiServiceSpy: jasmine.SpyObj<AuthApiService>;
  let userApiServiceSpy: jasmine.SpyObj<UserApiService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockUser = {
    _id: '123',
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: '2023-01-01T12:00:00Z',
    updatedAt: '2023-01-01T12:00:00Z'
  };

  beforeEach(async () => {
    authApiServiceSpy = jasmine.createSpyObj('AuthApiService', ['getCurrentUser']);
    userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getUserProfile']);
    authApiServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
          { path: 'profile', component: UserProfileComponent },
          { path: 'login', component: {} as any }
        ]),
        LucideAngularModule,
        UserProfileComponent
      ],
      providers: [
        { provide: AuthApiService, useValue: authApiServiceSpy },
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user information on init', fakeAsync(() => {
    component.ngOnInit();
    tick(); // Process async operations
    fixture.detectChanges();
    component.user$.subscribe(user => {
      expect(user).toBeTruthy();
      if (user) {
        expect(user._id).toBe('123');
        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@example.com');
        expect(user.createdAt).toBe('2023-01-01T12:00:00Z');
        expect(user.updatedAt).toBe('2023-01-01T12:00:00Z');
      }
    });
  }));

  it('should handle error when fetching user', fakeAsync(() => {
    authApiServiceSpy.getCurrentUser.and.returnValue(throwError(() => new Error('Failed to fetch user')));
    component.ngOnInit();
    
    tick();
    fixture.detectChanges();
    
    expect(component.error).toBe('Failed to fetch user');
    expect(component.loading).toBe(false);
  }));

  it('should display Lucide icons correctly', () => {
    fixture.detectChanges();
    const iconElements = fixture.debugElement.queryAll(By.css('lucide-icon'));
    expect(iconElements.length).toBeGreaterThan(0);
  });

  it('should have responsive container', () => {
    const container = fixture.debugElement.query(By.css('.profile-container'));
    expect(container.nativeElement.classList.contains('px-3')).toBeTruthy();
    expect(container.nativeElement.classList.contains('sm:px-6')).toBeTruthy();
    expect(container.nativeElement.classList.contains('py-4')).toBeTruthy();
    expect(container.nativeElement.classList.contains('sm:py-8')).toBeTruthy();
  });

  it('should have responsive card', () => {
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.nativeElement.classList.contains('p-4')).toBeTruthy();
    expect(card.nativeElement.classList.contains('sm:p-6')).toBeTruthy();
    expect(card.nativeElement.classList.contains('lg:p-8')).toBeTruthy();
  });

  it('should have responsive navigation link', () => {
    const navLink = fixture.debugElement.query(By.css('.nav-link'));
    expect(navLink.nativeElement.classList.contains('flex')).toBeTruthy();
    expect(navLink.nativeElement.classList.contains('items-center')).toBeTruthy();
    expect(navLink.nativeElement.classList.contains('gap-2')).toBeTruthy();
    expect(navLink.nativeElement.classList.contains('w-max')).toBeTruthy();
  });

  it('should have responsive profile header', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    const profileHeader = fixture.debugElement.query(By.css('.profile-header'));
    expect(profileHeader).toBeTruthy();
    expect(profileHeader.nativeElement.classList.contains('flex')).toBeTruthy();
    expect(profileHeader.nativeElement.classList.contains('flex-col')).toBeTruthy();
    expect(profileHeader.nativeElement.classList.contains('sm:flex-row')).toBeTruthy();
  }));

  it('should have responsive avatar', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    const avatar = fixture.debugElement.query(By.css('.avatar'));
    expect(avatar).toBeTruthy();
    expect(avatar.nativeElement.classList.contains('w-16')).toBeTruthy();
    expect(avatar.nativeElement.classList.contains('h-16')).toBeTruthy();
    expect(avatar.nativeElement.classList.contains('sm:w-20')).toBeTruthy();
    expect(avatar.nativeElement.classList.contains('sm:h-20')).toBeTruthy();
  }));

  it('should have responsive profile title', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    const profileTitle = fixture.debugElement.query(By.css('.profile-title'));
    expect(profileTitle).toBeTruthy();
    expect(profileTitle.nativeElement.classList.contains('text-center')).toBeTruthy();
    expect(profileTitle.nativeElement.classList.contains('sm:text-left')).toBeTruthy();
  }));

  it('should have responsive detail items', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    const detailItems = fixture.debugElement.queryAll(By.css('.detail-item'));
    expect(detailItems.length).toBeGreaterThan(0);
    
    detailItems.forEach(item => {
      expect(item.nativeElement.classList.contains('flex')).toBeTruthy();
      expect(item.nativeElement.classList.contains('flex-col')).toBeTruthy();
      expect(item.nativeElement.classList.contains('sm:flex-row')).toBeTruthy();
      expect(item.nativeElement.classList.contains('sm:items-center')).toBeTruthy();
    });
  }));

  it('should have responsive detail item labels', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    const labels = fixture.debugElement.queryAll(By.css('.label'));
    expect(labels.length).toBeGreaterThan(0);
    
    labels.forEach(label => {
      expect(label.nativeElement.classList.contains('mb-1')).toBeTruthy();
      expect(label.nativeElement.classList.contains('sm:mb-0')).toBeTruthy();
    });
  }));

  it('should update loading flag after initialization', fakeAsync(() => {
    component.loading = true; // Ensure loading is true initially
    component.ngOnInit();
    tick();
    expect(component.loading).toBe(false); // After observable completes
  }));
  
  it('should display error message when present', fakeAsync(() => {
    authApiServiceSpy.getCurrentUser.and.returnValue(throwError(() => new Error('Test error')));
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    const errorMessage = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('Test error');
  }));
});
