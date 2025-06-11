import { Component, OnInit } from '@angular/core';
import {
  LucideAngularModule, CatIcon, SearchIcon, UserIcon, LogOutIcon, AlertCircleIcon,
  ChevronRightIcon, ChevronLeftIcon, ExternalLinkIcon, ChevronDownIcon, LoaderIcon,
  InfoIcon, MapPinIcon, ClockIcon, WeightIcon, StarIcon
} from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../core/infrastructure/services/auth-api.service';
import { NotificationService } from '../../core/infrastructure/services/notification.service';
import { GetAllBreedsUseCase } from '../../core/application/use-cases/breeds/get-all-breeds.use-case';
import { GetBreedImagesUseCase } from '../../core/application/use-cases/breeds/get-breed-images.use-case';
import { GetBreedByIdUseCase } from '../../core/application/use-cases/breeds/get-breed-by-id.use-case';
import { Breed, BreedImage } from '../../core/domain/entities/breed.entity';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule]
})
export class HomeComponent implements OnInit {
  user: any;
  readonly CatIcon = CatIcon;
  readonly SearchIcon = SearchIcon;
  readonly UserIcon = UserIcon;
  readonly LogOutIcon = LogOutIcon;
  readonly ChevronDownIcon = ChevronDownIcon;
  readonly LoaderIcon = LoaderIcon;
  readonly ChevronLeftIcon = ChevronLeftIcon;
  readonly ChevronRightIcon = ChevronRightIcon;
  readonly AlertCircleIcon = AlertCircleIcon;
  readonly InfoIcon = InfoIcon;
  readonly MapPinIcon = MapPinIcon;
  readonly ClockIcon = ClockIcon;
  readonly WeightIcon = WeightIcon;
  readonly StarIcon = StarIcon;
  readonly ExternalLinkIcon = ExternalLinkIcon;

  breeds: Breed[] = [];
  selectedBreedId: string = '';
  selectedBreed: Breed | null = null;
  breedImages: BreedImage[] = [];
  currentImageIndex: number = 0;
  loading: boolean = false;
  breedLoading: boolean = false;
  imagesLoading: boolean = false;
  error: string | null = null;
  currentYear: number = new Date().getFullYear();

  constructor(
    private authService: AuthApiService,
    private router: Router,
    private notificationService: NotificationService,
    private getAllBreedsUseCase: GetAllBreedsUseCase,
    private getBreedByIdUseCase: GetBreedByIdUseCase,
    private getBreedImagesUseCase: GetBreedImagesUseCase
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });

    this.loadBreeds();
  }

  loadBreeds(): void {
    this.loading = true;
    this.getAllBreedsUseCase.execute()
      .pipe(
        catchError(error => {
          this.error = 'Failed to load breeds. Please try again.';
          this.notificationService.error(this.error);
          console.error('Error loading breeds:', error);
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(breeds => {
        this.breeds = breeds;
        if (breeds.length > 0) {
          this.selectedBreedId = breeds[0].id;
          this.onBreedSelected();
        }
      });
  }

  onBreedSelected(): void {
    if (!this.selectedBreedId) return;

    this.breedLoading = true;
    this.imagesLoading = true;
    this.selectedBreed = null;
    this.breedImages = [];
    this.currentImageIndex = 0;

    // Load breed details
    this.getBreedByIdUseCase.execute(this.selectedBreedId)
      .pipe(
        catchError(error => {
          this.error = 'Failed to load breed details. Please try again.';
          this.notificationService.error(this.error);
          console.error('Error loading breed details:', error);
          return of(null);
        }),
        finalize(() => this.breedLoading = false)
      )
      .subscribe(breed => {
        if (breed) {
          this.selectedBreed = breed;
        }
      });

    // Load breed images
    this.getBreedImagesUseCase.execute(this.selectedBreedId, 10)
      .pipe(
        catchError(error => {
          this.error = 'Failed to load breed images. Please try again.';
          this.notificationService.error(this.error);
          console.error('Error loading breed images:', error);
          return of([]);
        }),
        finalize(() => this.imagesLoading = false)
      )
      .subscribe(images => {
        this.breedImages = images;
      });
  }

  previousImage(): void {
    if (this.breedImages.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.breedImages.length) % this.breedImages.length;
  }

  nextImage(): void {
    if (this.breedImages.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.breedImages.length;
  }

  isLoggingOut = false;

  logout(): void {
    if (this.isLoggingOut) return; // Prevent multiple logout attempts

    this.isLoggingOut = true;
    console.log('Logging out...');

    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.notificationService.success('Has cerrado sesión exitosamente');

        // Use more reliable navigation with replaceUrl and fallback
        this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
          this.isLoggingOut = false;
        }).catch(err => {
          console.error('Navigation error:', err);
          // Fallback navigation if router fails
          this.isLoggingOut = false;
          window.location.href = '/login';
        });
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.isLoggingOut = false;

        // Clear auth data anyway for better UX
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');

        this.notificationService.error('Ocurrió un error durante el cierre de sesión. Intenta de nuevo.');

        // Navigate to login even if there was an error
        setTimeout(() => {
          this.router.navigate(['/login'], { replaceUrl: true }).catch(() => {
            window.location.href = '/login';
          });
        }, 1500);
      }
    });
  }

  getRatingStars(rating: number): string[] {
    return Array(rating).fill('★');
  }
}
