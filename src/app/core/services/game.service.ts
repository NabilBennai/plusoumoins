import { Injectable } from '@angular/core';
import { AnswerResult, GameQuestion, Guess } from '../models/game-question.model';
import { Item } from '../models/item.model';

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
    return `${new Intl.NumberFormat('fr-FR').format(value)} ${unit}`;
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
