import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [AsyncPipe, CategoryCardComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  readonly categories$: Observable<Category[]> = this.categoryService.getCategories();

  constructor(private readonly categoryService: CategoryService) {}
}
