import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { Category } from '../../core/models/category.model';
import { AnswerResult, GameQuestion, Guess } from '../../core/models/game-question.model';
import { Item } from '../../core/models/item.model';
import { CategoryService } from '../../core/services/category.service';
import { GameService } from '../../core/services/game.service';
import { ScoreService } from '../../core/services/score.service';
import { GameCardComponent } from '../../shared/components/game-card/game-card.component';
import { ResultPanelComponent } from '../../shared/components/result-panel/result-panel.component';
import { ScoreBoardComponent } from '../../shared/components/score-board/score-board.component';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [RouterLink, GameCardComponent, ResultPanelComponent, ScoreBoardComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent implements OnInit, OnDestroy {
  category?: Category;
  question?: GameQuestion;
  answerResult?: AnswerResult;
  errorMessage = '';
  score = 0;
  bestScore = 0;
  gameOver = false;
  isLoading = true;

  private items: Item[] = [];
  private nextQuestionTimeout?: ReturnType<typeof setTimeout>;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly categoryService: CategoryService,
    private readonly gameService: GameService,
    private readonly scoreService: ScoreService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('categorySlug');

          if (!slug) {
            return of({ category: undefined, items: [] });
          }

          return this.categoryService.getCategoryBySlug(slug).pipe(
            switchMap((category) => {
              if (!category) {
                return of({ category: undefined, items: [] });
              }

              return forkJoin({
                category: of(category),
                items: this.categoryService.getItemsByCategorySlug(slug),
              });
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: ({ category, items }) => this.startCategory(category, items),
        error: () => this.showError("Impossible de charger les données de cette catégorie."),
      });
  }

  ngOnDestroy(): void {
    this.clearNextQuestionTimeout();
    this.destroy$.next();
    this.destroy$.complete();
  }

  answer(guess: Guess): void {
    if (!this.question || this.answerResult || this.gameOver) {
      return;
    }

    this.answerResult = this.gameService.checkAnswer(this.question, guess);

    if (this.answerResult.isCorrect) {
      this.score += 1;
      this.bestScore = this.saveBestScore();
      this.nextQuestionTimeout = setTimeout(() => this.nextQuestion(), 1100);
      return;
    }

    this.gameOver = true;
    this.bestScore = this.saveBestScore();
  }

  restart(): void {
    this.score = 0;
    this.gameOver = false;
    this.answerResult = undefined;
    this.nextQuestion();
  }

  getLeftValueText(): string {
    return this.getValueText(this.question?.left.value);
  }

  getRightValueText(): string {
    return this.getValueText(this.question?.right.value);
  }

  private startCategory(category: Category | undefined, items: Item[]): void {
    if (!category) {
      this.showError("Cette catégorie n'existe pas encore.");
      return;
    }

    if (items.length < 2) {
      this.showError('Cette catégorie doit contenir au moins deux éléments.');
      return;
    }

    this.category = category;
    this.items = items;
    this.score = 0;
    this.bestScore = this.scoreService.getBestScore(category.slug);
    this.gameOver = false;
    this.errorMessage = '';
    this.isLoading = false;
    this.nextQuestion();
  }

  private nextQuestion(): void {
    this.clearNextQuestionTimeout();
    this.answerResult = undefined;
    this.question = this.gameService.createQuestion(this.items, this.question);
  }

  private getValueText(value: number | undefined): string {
    if (!this.category || value === undefined) {
      return '';
    }

    return this.gameService.formatValue(value, this.category.unit);
  }

  private saveBestScore(): number {
    return this.category ? this.scoreService.saveBestScore(this.category.slug, this.score) : this.bestScore;
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.category = undefined;
    this.question = undefined;
  }

  private clearNextQuestionTimeout(): void {
    if (this.nextQuestionTimeout) {
      clearTimeout(this.nextQuestionTimeout);
      this.nextQuestionTimeout = undefined;
    }
  }
}
