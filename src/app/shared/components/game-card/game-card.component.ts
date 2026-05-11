import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { Item } from '../../../core/models/item.model';
import { LanguageService } from '../../../core/services/language.service';
import { WikipediaImageService } from '../../../core/services/wikipedia-image.service';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent implements OnChanges {
  @Input({ required: true }) item!: Item;
  @Input({ required: true }) title!: string;
  @Input() valueText = '';
  @Input() revealValue = false;
  @Input() clickable = false;
  @Input() selected = false;
  @Input() result: 'correct' | 'wrong' | undefined;
  @Output() cardClick = new EventEmitter<void>();

  protected resolvedImageUrl = '';

  private readonly wikiImageService = inject(WikipediaImageService);
  private readonly languageService = inject(LanguageService);
  private readonly currentLang = toSignal(this.languageService.currentLang$, { initialValue: 'fr' });

  get displayName(): string {
    return this.item.names?.[this.currentLang()] ?? this.item.name;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['item']) return;

    this.resolvedImageUrl = this.item.imageUrl;

    if (this.item.imageUrl.includes('/placeholders/')) {
      this.wikiImageService.getImageUrl(this.item.name).subscribe((url) => {
        if (url) this.resolvedImageUrl = url;
      });
    }
  }

  selectCard(): void {
    if (!this.clickable) return;
    this.cardClick.emit();
  }
}
