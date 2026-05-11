import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly title = 'Plus ou Moins';
  readonly langs: typeof this.languageService.langs;
  currentLang = '';

  constructor(private readonly languageService: LanguageService) {
    this.langs = this.languageService.langs;
  }

  ngOnInit(): void {
    this.languageService.init();
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  setLanguage(code: string): void {
    this.languageService.setLanguage(code);
  }
}
