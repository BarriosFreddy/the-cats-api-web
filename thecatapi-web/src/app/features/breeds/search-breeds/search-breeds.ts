import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, CatIcon, UserIcon, ChevronRightIcon, LoaderIcon, ChevronLeftIcon } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, catchError, finalize } from 'rxjs';
import { SearchBreedsUseCase } from '../../../core/application/use-cases/breeds/search-breeds.use-case';
import { NotificationService } from '../../../core/infrastructure/services/notification.service';
import { Breed } from '../../../core/domain/entities/breed.entity';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-breeds',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './search-breeds.html',
  styleUrls: ['./search-breeds.css']
})
export class SearchBreedsComponent implements OnInit {
  readonly CatIcon = CatIcon;
  readonly UserIcon = UserIcon;
  readonly LoaderIcon = LoaderIcon;
  readonly ChevronRightIcon = ChevronRightIcon;
  readonly ChevronLeftIcon = ChevronLeftIcon;

  searchForm!: FormGroup;
  searchResults: Breed[] = [];
  isLoading = false;
  hasSearched = false;
  errorMessage = '';
  
  constructor(
    private searchBreedsUseCase: SearchBreedsUseCase,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.searchForm = new FormGroup({
      query: new FormControl('', [Validators.required, Validators.minLength(2)])
    });
  }
  
  onSearch(): void {
    if (this.searchForm.invalid) {
      this.notificationService.warning('Por favor ingresa al menos 2 caracteres para buscar');
      return;
    }
    
    const query = this.searchForm.get('query')?.value.trim();
    
    if (!query) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = true;
    
    this.searchBreedsUseCase.execute(query).pipe(
      catchError(error => {
        console.error('Error searching breeds:', error);
        this.errorMessage = 'Error al buscar razas. Por favor intenta de nuevo.';
        this.notificationService.error(this.errorMessage);
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(results => {
      this.searchResults = results;
      if (results.length === 0 && !this.errorMessage) {
        this.notificationService.info('No se encontraron resultados para tu búsqueda');
      } else if (results.length > 0) {
        this.notificationService.success(`Se encontraron ${results.length} razas`);
      }
    });
  }
  
  getRatingStars(rating: number): string[] {
    return Array(rating).fill('★');
  }
}
