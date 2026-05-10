import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-result-panel',
  standalone: true,
  templateUrl: './result-panel.component.html',
  styleUrl: './result-panel.component.scss',
})
export class ResultPanelComponent {
  @Input({ required: true }) isCorrect = false;
  @Input() rightValueText = '';
  @Input() finalScore = 0;
  @Input() bestScore = 0;
  @Input() gameOver = false;
  @Output() restart = new EventEmitter<void>();
}
