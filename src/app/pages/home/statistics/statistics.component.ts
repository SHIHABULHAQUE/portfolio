import { Component, ElementRef, OnDestroy, WritableSignal, afterNextRender, signal } from '@angular/core';
import { gsap } from 'gsap';

interface Stat {
  target: number;
  decimals: number;
  label: string;
  display: WritableSignal<string>;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  template: `
    <section class="stats" aria-label="Career at a glance">
      @for (stat of stats; track stat.label) {
        <div class="stat">
          <span class="value">{{ stat.display() }}<sup>+</sup></span>
          <span class="label">{{ stat.label }}</span>
        </div>
      }
    </section>
  `,
  styles: [`
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      margin: 2rem 0 0;

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .stat {
      padding: 2.4rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      border-left: 1px solid var(--line);

      &:first-child { border-left: none; }

      @media (max-width: 768px) {
        &:nth-child(3) { border-left: none; }
        &:nth-child(-n + 2) { border-bottom: 1px solid var(--line); }
      }
    }
    .value {
      font-family: var(--font-serif);
      font-size: clamp(2.6rem, 5vw, 3.8rem);
      line-height: 1;
      color: var(--ink);

      sup {
        font-size: 0.45em;
        color: var(--sand);
        margin-left: 0.1em;
      }
    }
    .label {
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink-soft);
    }
  `]
})
export class StatisticsComponent implements OnDestroy {
  stats: Stat[] = [
    { target: 5.6, decimals: 1, label: 'Years of experience', display: signal('5.6') },
    { target: 12, decimals: 0, label: 'Projects delivered', display: signal('12') },
    { target: 6, decimals: 0, label: 'Banking solutions', display: signal('6') },
    { target: 15, decimals: 0, label: 'Technologies', display: signal('15') }
  ];

  private observer?: IntersectionObserver;

  constructor(private host: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.stats.forEach(s => s.display.set((0).toFixed(s.decimals)));

      this.observer = new IntersectionObserver(entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        this.observer?.disconnect();
        this.stats.forEach((stat, i) => {
          const counter = { v: 0 };
          gsap.to(counter, {
            v: stat.target,
            duration: 2,
            delay: i * 0.12,
            ease: 'power2.out',
            onUpdate: () => stat.display.set(counter.v.toFixed(stat.decimals))
          });
        });
      }, { threshold: 0.4 });
      this.observer.observe(this.host.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
