import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  @Input({ required: true }) category!: Category;
}
