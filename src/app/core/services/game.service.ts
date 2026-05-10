import { Injectable } from '@angular/core';
import { AnswerResult, GameQuestion, Guess } from '../models/game-question.model';
import { Item } from '../models/item.model';

const LIGHT_YEAR_IN_METERS = 9.461e15;

@Injectable({ providedIn: 'root' })
export class GameService {
  createQuestion(items: Item[], previousQuestion?: GameQuestion): GameQuestion {
    if (items.length < 2) {
      throw new Error('Une catégorie doit contenir au moins deux éléments pour jouer.');
    }

    let question = this.pickQuestion(items);

    if (previousQuestion && items.length > 2) {
      const previousPair = this.getPairKey(previousQuestion);
      let attempts = 0;

      while (this.getPairKey(question) === previousPair && attempts < 8) {
        question = this.pickQuestion(items);
        attempts += 1;
      }
    }

    return question;
  }

  checkAnswer(question: GameQuestion, guess: Guess): AnswerResult {
    const rightIsGreaterOrEqual = question.right.value >= question.left.value;
    const isCorrect = guess === 'plus' ? rightIsGreaterOrEqual : !rightIsGreaterOrEqual;

    return { guess, isCorrect };
  }

  formatValue(value: number, unit: string): string {
    if (unit === 'm') {
      return this.formatMeters(value);
    }
    return `${new Intl.NumberFormat('fr-FR').format(value)} ${unit}`;
  }

  private formatMeters(meters: number): string {
    const fmt = (n: number) =>
      new Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 4 }).format(n);

    if (meters >= LIGHT_YEAR_IN_METERS) {
      const ly = meters / LIGHT_YEAR_IN_METERS;
      if (ly >= 1e9) {
        const val = ly / 1e9;
        return `${fmt(val)} milliard${val >= 2 ? 's' : ''} d'années-lumière`;
      }
      if (ly >= 1e6) {
        const val = ly / 1e6;
        return `${fmt(val)} million${val >= 2 ? 's' : ''} d'années-lumière`;
      }
      return `${fmt(ly)} année${ly >= 2 ? 's' : ''}-lumière`;
    }

    const km = meters / 1000;

    if (km >= 1e9) {
      const val = km / 1e9;
      return `${fmt(val)} milliard${val >= 2 ? 's' : ''} de km`;
    }

    if (km >= 1e6) {
      const val = km / 1e6;
      return `${fmt(val)} million${val >= 2 ? 's' : ''} de km`;
    }

    return `${fmt(km)} km`;
  }

  private pickQuestion(items: Item[]): GameQuestion {
    const leftIndex = this.randomIndex(items.length);
    let rightIndex = this.randomIndex(items.length);

    while (rightIndex === leftIndex) {
      rightIndex = this.randomIndex(items.length);
    }

    return {
      left: items[leftIndex],
      right: items[rightIndex],
    };
  }

  private randomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }

  private getPairKey(question: GameQuestion): string {
    return `${question.left.id}:${question.right.id}`;
  }
}
