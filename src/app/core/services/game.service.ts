import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnswerResult, GameQuestion, Guess } from '../models/game-question.model';
import { Item } from '../models/item.model';

const LIGHT_YEAR_IN_METERS = 9.461e15;

const LOCALE_MAP: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
};

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private readonly translate: TranslateService) {}

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
    const locale = LOCALE_MAP[this.translate.getCurrentLang()] ?? 'fr-FR';
    const translatedUnit = this.translate.instant(`UNIT.${unit}`);
    const displayUnit = translatedUnit !== `UNIT.${unit}` ? translatedUnit : unit;
    return `${new Intl.NumberFormat(locale).format(value)} ${displayUnit}`;
  }

  private formatMeters(meters: number): string {
    const locale = LOCALE_MAP[this.translate.getCurrentLang()] ?? 'fr-FR';
    const fmt = (n: number) =>
      new Intl.NumberFormat(locale, { maximumSignificantDigits: 4 }).format(n);
    const t = (key: string) => this.translate.instant(key);

    if (meters >= LIGHT_YEAR_IN_METERS) {
      const ly = meters / LIGHT_YEAR_IN_METERS;
      if (ly >= 1e9) {
        const val = ly / 1e9;
        return `${fmt(val)} ${t(val >= 2 ? 'SPACE.B_LY_P' : 'SPACE.B_LY_S')}`;
      }
      if (ly >= 1e6) {
        const val = ly / 1e6;
        return `${fmt(val)} ${t(val >= 2 ? 'SPACE.M_LY_P' : 'SPACE.M_LY_S')}`;
      }
      return `${fmt(ly)} ${t(ly >= 2 ? 'SPACE.LY_P' : 'SPACE.LY_S')}`;
    }

    const km = meters / 1000;

    if (km >= 1e9) {
      const val = km / 1e9;
      return `${fmt(val)} ${t(val >= 2 ? 'SPACE.B_KM_P' : 'SPACE.B_KM_S')}`;
    }

    if (km >= 1e6) {
      const val = km / 1e6;
      return `${fmt(val)} ${t(val >= 2 ? 'SPACE.M_KM_P' : 'SPACE.M_KM_S')}`;
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
