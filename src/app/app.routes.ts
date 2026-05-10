import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { PlayComponent } from './pages/play/play.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Accueil | Plus ou Moins' },
  { path: 'categories', component: CategoriesComponent, title: 'Catégories | Plus ou Moins' },
  { path: 'play/:categorySlug', component: PlayComponent, title: 'Jouer | Plus ou Moins' },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' },
];
