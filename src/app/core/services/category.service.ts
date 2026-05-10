import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { Category } from '../models/category.model';
import { Item } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly dataPath = 'assets/data';
  private readonly categories$ = this.http
    .get<Category[]>(`${this.dataPath}/categories.json`)
    .pipe(shareReplay(1));

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.categories$.pipe(map((categories) => categories.find((c) => c.slug === slug)));
  }

  getItemsByCategorySlug(slug: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.dataPath}/${slug}.json`);
  }
}
