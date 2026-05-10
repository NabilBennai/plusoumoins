import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CategoryCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly featuredCategories$: Observable<Category[]> = this.categoryService
    .getCategories()
    .pipe(map((categories) => categories.slice(0, 2)));

  constructor(private readonly categoryService: CategoryService) {}
}
