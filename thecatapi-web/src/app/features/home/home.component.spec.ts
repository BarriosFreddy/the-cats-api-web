import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { AuthApiService } from '../../core/infrastructure/services/auth-api.service';
import { GetAllBreedsUseCase } from '../../core/application/use-cases/breeds/get-all-breeds.use-case';
import { GetBreedImagesUseCase } from '../../core/application/use-cases/breeds/get-breed-images.use-case';
import { GetBreedByIdUseCase } from '../../core/application/use-cases/breeds/get-breed-by-id.use-case';
import { NotificationService } from '../../core/infrastructure/services/notification.service';
import { LucideAngularModule } from 'lucide-angular';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Breed, BreedImage } from '../../core/domain/entities/breed.entity';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthApiService>;
  let getAllBreedsUseCaseSpy: jasmine.SpyObj<GetAllBreedsUseCase>;
  let getBreedImagesUseCaseSpy: jasmine.SpyObj<GetBreedImagesUseCase>;
  let getBreedByIdUseCaseSpy: jasmine.SpyObj<GetBreedByIdUseCase>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    // Mock user data
    authServiceSpy = jasmine.createSpyObj('AuthApiService', ['logout', 'getCurrentUser']);
    authServiceSpy.getCurrentUser.and.returnValue(of({ id: '123', name: 'Test User', email: 'test@example.com' }));
    
    // Mock breed data
    const mockBreeds: Breed[] = [
      { 
        id: 'abys', 
        name: 'Abyssinian', 
        origin: 'Egypt', 
        temperament: 'Active, Energetic', 
        description: 'Test description',
        life_span: '14 - 15',
        weight: {
          imperial: '7 - 10',
          metric: '3 - 5'
        },
        adaptability: 5,
        affection_level: 4,
        child_friendly: 4,
        dog_friendly: 3,
        energy_level: 5,
        grooming: 1,
        health_issues: 2,
        intelligence: 5,
        social_needs: 5,
        stranger_friendly: 3
      },
      { 
        id: 'siam', 
        name: 'Siamese', 
        origin: 'Thailand', 
        temperament: 'Calm, Social', 
        description: 'Another description',
        life_span: '12 - 15',
        weight: {
          imperial: '8 - 12',
          metric: '4 - 6'
        },
        adaptability: 4,
        affection_level: 5,
        child_friendly: 3,
        dog_friendly: 3,
        energy_level: 4,
        grooming: 2,
        health_issues: 3,
        intelligence: 5,
        social_needs: 5,
        stranger_friendly: 4
      }
    ];
    
    // Mock breed images
    const mockImages: BreedImage[] = [
      { id: 'img1', url: 'https://example.com/cat1.jpg', width: 500, height: 400 },
      { id: 'img2', url: 'https://example.com/cat2.jpg', width: 600, height: 500 }
    ];
    
    getAllBreedsUseCaseSpy = jasmine.createSpyObj('GetAllBreedsUseCase', ['execute']);
    getAllBreedsUseCaseSpy.execute.and.returnValue(of(mockBreeds));
    
    getBreedImagesUseCaseSpy = jasmine.createSpyObj('GetBreedImagesUseCase', ['execute']);
    getBreedImagesUseCaseSpy.execute.and.returnValue(of(mockImages));
    
    getBreedByIdUseCaseSpy = jasmine.createSpyObj('GetBreedByIdUseCase', ['execute']);
    getBreedByIdUseCaseSpy.execute.and.returnValue(of(mockBreeds[0]));
    
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);


    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: HomeComponent },
          { path: 'login', component: {} as any }
        ]),
        LucideAngularModule,
        FormsModule,
        HomeComponent
      ],
      providers: [
        { provide: AuthApiService, useValue: authServiceSpy },
        { provide: GetAllBreedsUseCase, useValue: getAllBreedsUseCaseSpy },
        { provide: GetBreedImagesUseCase, useValue: getBreedImagesUseCaseSpy },
        { provide: GetBreedByIdUseCase, useValue: getBreedByIdUseCaseSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load breeds data on init', () => {
    const mockBreeds: Breed[] = [
      { 
        id: '1', 
        name: 'Bengal', 
        description: 'Active cat breed',
        temperament: 'Active', 
        origin: 'USA', 
        life_span: '12-16', 
        weight: { imperial: '6-12', metric: '3-6' },
        adaptability: 5,
        affection_level: 5,
        child_friendly: 4,
        dog_friendly: 4,
        energy_level: 5,
        grooming: 3,
        health_issues: 3,
        intelligence: 5,
        social_needs: 5,
        stranger_friendly: 3
      }
    ];
    getAllBreedsUseCaseSpy.execute.and.returnValue(of(mockBreeds));
    component.ngOnInit();
    expect(component.breeds.length).toBe(1);
  });

  it('should handle error when loading breeds', () => {
    getAllBreedsUseCaseSpy.execute.and.returnValue(throwError(() => new Error('Failed to load breeds')));
    component.ngOnInit();
    expect(component.error).toBeTruthy();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  it('should load breed images when breed is selected', () => {
    const mockBreedImages: BreedImage[] = [
      { id: '1', url: 'https://example.com/cat.jpg' },
      { id: '2', url: 'https://example.com/cat2.jpg' }
    ];
    getBreedImagesUseCaseSpy.execute.and.returnValue(of(mockBreedImages));
    
    component.selectedBreedId = '1';
    component.onBreedSelected();
    
    expect(component.breedImages).toEqual(mockBreedImages);
  });

  it('should logout user successfully', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    authServiceSpy.logout.and.returnValue(of(undefined));
    component.logout();
    
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], jasmine.objectContaining({replaceUrl: true}));
    expect(notificationServiceSpy.success).toHaveBeenCalledWith('Has cerrado sesión exitosamente');
  });

  it('should handle logout failure', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    authServiceSpy.logout.and.returnValue(throwError(() => new Error('Logout failed')));
    component.logout();
    fixture.detectChanges();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  // Test for Lucide icon integration
  it('should have correct icon properties', () => {
    expect(component.SearchIcon).toBeDefined();
    expect(component.UserIcon).toBeDefined();
    expect(component.LogOutIcon).toBeDefined();
    expect(component.ChevronDownIcon).toBeDefined();
    expect(component.ChevronLeftIcon).toBeDefined();
    expect(component.ChevronRightIcon).toBeDefined();
    expect(component.CatIcon).toBeDefined();
  });

  // Test for responsive design elements
  it('should have responsive navigation layout', () => {
    const navContainer = fixture.debugElement.query(By.css('.flex.flex-col.py-4'));
    expect(navContainer).toBeTruthy();
    
    // Check for the two-row layout structure
    const titleRow = fixture.debugElement.query(By.css('.flex.flex-col.sm\\:flex-row.justify-between'));
    expect(titleRow).toBeTruthy();
    
    // Check for responsive button row
    const buttonRow = fixture.debugElement.query(By.css('.flex.justify-center.sm\\:justify-end'));
    expect(buttonRow).toBeTruthy();
  });

  it('should have responsive circular buttons on mobile', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.btn'));
    
    buttons.forEach(button => {
      // Check for circular styling on mobile
      expect(button.nativeElement.classList.contains('rounded-full')).toBeTruthy();
      expect(button.nativeElement.classList.contains('sm:rounded-md')).toBeTruthy();
      
      // Check for button sizing
      expect(button.nativeElement.classList.contains('w-16')).toBeTruthy();
      expect(button.nativeElement.classList.contains('h-16')).toBeTruthy();
      expect(button.nativeElement.classList.contains('sm:w-auto')).toBeTruthy();
      expect(button.nativeElement.classList.contains('sm:h-auto')).toBeTruthy();
    });
  });

  it('should hide button text labels on mobile', () => {
    const buttonLabels = fixture.debugElement.queryAll(By.css('.btn span'));
    
    buttonLabels.forEach(label => {
      expect(label.nativeElement.classList.contains('hidden')).toBeTruthy();
      expect(label.nativeElement.classList.contains('sm:inline')).toBeTruthy();
    });
  });
  
  it('should have larger icons on mobile', () => {
    const icons = fixture.debugElement.queryAll(By.css('.btn lucide-icon'));
    
    icons.forEach(icon => {
      expect(icon.nativeElement.classList.contains('h-6')).toBeTruthy();
      expect(icon.nativeElement.classList.contains('w-6')).toBeTruthy();
      expect(icon.nativeElement.classList.contains('sm:h-5')).toBeTruthy();
      expect(icon.nativeElement.classList.contains('sm:w-5')).toBeTruthy();
    });
  });
});
