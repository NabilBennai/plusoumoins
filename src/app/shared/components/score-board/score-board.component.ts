import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-score-board',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.scss',
})
export class ScoreBoardComponent {
  @Input({ required: true }) score = 0;
  @Input({ required: true }) bestScore = 0;
}
