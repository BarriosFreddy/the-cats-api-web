import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { SearchBreedsComponent } from './features/breeds/search-breeds/search-breeds';
import { UserProfileComponent } from './features/profile/user-profile.component';
import { authGuard } from './core/infrastructure/guards/auth.guard';
import { loggedInGuard } from './core/infrastructure/guards/loggedIn.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loggedInGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loggedInGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'breeds/search',
    component: SearchBreedsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
