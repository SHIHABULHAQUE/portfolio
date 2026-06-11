import { Injectable, signal, computed, effect } from '@angular/core';

export type AccentColor = '#00f0ff' | '#bd00ff' | '#64ffda' | '#ff5e00';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal containing the active accent color
  activeAccent = signal<AccentColor>('#00f0ff');

  // Computed state converting the hex color into RGB coordinates
  activeAccentRgb = computed(() => this.hexToRgb(this.activeAccent()));

  // Computed glow string
  accentGlow = computed(() => `rgba(${this.activeAccentRgb()}, 0.25)`);

  constructor() {
    // Automatically propagate accent shifts to the global CSS engine
    effect(() => {
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--primary', this.activeAccent());
        document.documentElement.style.setProperty('--primary-rgb', this.activeAccentRgb());
        document.documentElement.style.setProperty('--primary-glow', this.accentGlow());
      }
    });
  }

  setAccent(color: AccentColor): void {
    this.activeAccent.set(color);
  }

  private hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}
