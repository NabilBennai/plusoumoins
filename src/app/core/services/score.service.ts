import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly prefix = 'plus-ou-moins-best-score';

  getBestScore(categorySlug: string): number {
    const storedScore = localStorage.getItem(this.getStorageKey(categorySlug));
    return storedScore ? Number(storedScore) : 0;
  }

  saveBestScore(categorySlug: string, score: number): number {
    const bestScore = Math.max(score, this.getBestScore(categorySlug));
    localStorage.setItem(this.getStorageKey(categorySlug), String(bestScore));
    return bestScore;
  }

  private getStorageKey(categorySlug: string): string {
    return `${this.prefix}:${categorySlug}`;
  }
}
