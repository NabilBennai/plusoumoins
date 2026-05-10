import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../../core/models/item.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent {
  @Input({ required: true }) item!: Item;
  @Input({ required: true }) title!: string;
  @Input() valueText = '';
  @Input() revealValue = false;
  @Input() clickable = false;
  @Input() selected = false;
  @Input() result: 'correct' | 'wrong' | undefined;
  @Output() cardClick = new EventEmitter<void>();

  selectCard(): void {
    if (!this.clickable) {
      return;
    }

    this.cardClick.emit();
  }
}
