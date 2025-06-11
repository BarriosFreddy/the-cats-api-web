import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchBreedsComponent } from './search-breeds';
import { SearchBreedsUseCase } from '../../../core/application/use-cases/breeds/search-breeds.use-case';
import { NotificationService } from '../../../core/infrastructure/services/notification.service';
import { LucideAngularModule } from 'lucide-angular';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Breed } from '../../../core/domain/entities/breed.entity';

describe('SearchBreedsComponent', () => {
  let component: SearchBreedsComponent;
  let fixture: ComponentFixture<SearchBreedsComponent>;
  let searchBreedsUseCaseSpy: jasmine.SpyObj<SearchBreedsUseCase>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    searchBreedsUseCaseSpy = jasmine.createSpyObj('SearchBreedsUseCase', ['execute']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'breeds/search', component: SearchBreedsComponent }
        ]),
        LucideAngularModule,
        SearchBreedsComponent
      ],
      providers: [
        { provide: SearchBreedsUseCase, useValue: searchBreedsUseCaseSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBreedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty query', () => {
    expect(component.searchForm.get('query')?.value).toBe('');
  });

  it('should have form invalid when empty', () => {
    expect(component.searchForm.valid).toBeFalsy();
  });

  it('should validate query field as required', () => {
    const query = component.searchForm.get('query');
    query?.setValue('');
    expect(query?.valid).toBeFalsy();
    expect(query?.errors?.['required']).toBeTruthy();
    
    query?.setValue('Bengal');
    expect(query?.valid).toBeTruthy();
  });

  it('should validate minimum length of query', () => {
    const query = component.searchForm.get('query');
    query?.setValue('a');
    expect(query?.valid).toBeFalsy();
    expect(query?.errors?.['minlength']).toBeTruthy();
    
    query?.setValue('ab'); // 2 chars minimum
    expect(query?.valid).toBeTruthy();
  });

  it('should show warning when trying to search with invalid form', () => {
    component.onSearch();
    expect(notificationServiceSpy.warning).toHaveBeenCalled();
  });

  it('should display Lucide icons correctly', () => {
    fixture.detectChanges();
    const iconElements = fixture.debugElement.queryAll(By.css('lucide-icon'));
    expect(iconElements.length).toBeGreaterThan(0);
  });

  it('should search breeds when form is valid', () => {
    const mockBreeds: Breed[] = [{ 
      id: '1', 
      name: 'Bengal', 
      description: 'Active cat',
      temperament: 'Active, Playful',
      origin: 'USA',
      life_span: '12-15',
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
    }];
    searchBreedsUseCaseSpy.execute.and.returnValue(of(mockBreeds));
    
    component.searchForm.get('query')?.setValue('Bengal');
    component.onSearch();
    
    expect(component.isLoading).toBeFalse();
    expect(component.hasSearched).toBeTrue();
    expect(component.searchResults).toEqual(mockBreeds);
  });

  it('should handle search error', () => {
    searchBreedsUseCaseSpy.execute.and.returnValue(throwError(() => new Error('Search failed')));
    
    component.searchForm.get('query')?.setValue('Bengal');
    component.onSearch();
    
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBeTruthy();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  it('should have proper responsive design classes', () => {
    // Check for responsive container
    const container = fixture.debugElement.query(By.css('.container'));
    expect(container).toBeTruthy();
    
    // Check for responsive search form
    const searchForm = fixture.debugElement.query(By.css('.bg-white.shadow-lg'));
    expect(searchForm.nativeElement.classList.contains('p-4')).toBeTruthy();
    expect(searchForm.nativeElement.classList.contains('sm:p-8')).toBeTruthy();
  });
});
