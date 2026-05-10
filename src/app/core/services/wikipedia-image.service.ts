import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WikipediaImageService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, string | null>();

  getImageUrl(name: string): Observable<string | null> {
    if (this.cache.has(name)) {
      return of(this.cache.get(name) as string | null);
    }

    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: name,
      prop: 'pageimages',
      pithumbsize: '600',
      origin: '*',
    });

    return this.http
      .get<WikipediaResponse>(`https://fr.wikipedia.org/w/api.php?${params}`)
      .pipe(
        map((res) => {
          const page = Object.values(res?.query?.pages ?? {})[0];
          const url = page?.thumbnail?.source ?? null;
          this.cache.set(name, url);
          return url;
        }),
        catchError(() => {
          this.cache.set(name, null);
          return of(null);
        }),
      );
  }
}

interface WikipediaResponse {
  query?: {
    pages?: Record<string, { thumbnail?: { source: string } }>;
  };
}
