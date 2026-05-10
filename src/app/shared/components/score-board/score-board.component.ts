import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-board',
  standalone: true,
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.scss',
})
export class ScoreBoardComponent {
  @Input({ required: true }) score = 0;
  @Input({ required: true }) bestScore = 0;
}
