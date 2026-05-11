import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export const SUPPORTED_LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
] as const;

const STORAGE_KEY = 'plusoumoins_lang';
const VALID_LANGS = SUPPORTED_LANGS.map((l) => l.code);

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly langs = SUPPORTED_LANGS;
  readonly currentLang$ = new BehaviorSubject<string>(this.resolveInitialLang());

  constructor(private readonly translate: TranslateService) {}

  init(): void {
    const lang = this.currentLang$.value;
    this.translate.use(lang);
    document.documentElement.lang = lang;
  }

  setLanguage(code: string): void {
    if (!VALID_LANGS.includes(code as 'fr' | 'en' | 'es')) return;
    this.translate.use(code);
    this.currentLang$.next(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
  }

  private resolveInitialLang(): string {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LANGS.includes(stored as 'fr' | 'en' | 'es')) return stored;
    const browser = navigator.language.split('-')[0];
    if (VALID_LANGS.includes(browser as 'fr' | 'en' | 'es')) return browser;
    return 'fr';
  }
}
