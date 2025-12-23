import { Injectable, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = 'theme';
  private currentTheme: Theme = 'light';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // ✅ Runs AFTER hydration
      afterNextRender(() => {
        const saved =
          (localStorage.getItem(this.themeKey) as Theme) ?? 'light';
        this.applyTheme(saved);
      });
    }
  }

  toggleTheme() {
    if (!this.isBrowser) return;

    const next: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(next);
  }

  isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  private applyTheme(theme: Theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);

    this.currentTheme = theme;
    localStorage.setItem(this.themeKey, theme);
  }
}
