import { Item } from './item.model';

export type Guess = 'plus' | 'moins';

export interface GameQuestion {
  left: Item;
  right: Item;
}

export interface AnswerResult {
  guess: Guess;
  isCorrect: boolean;
}
