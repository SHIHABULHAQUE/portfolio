import { Directive, ElementRef, Input, OnDestroy, afterNextRender } from '@angular/core';
import { prefersReducedMotion } from '../utils/ticker';

/**
 * Counts a number up from zero the first time it scrolls into view.
 * The server-rendered text already holds the final value, so nothing is lost without JS.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnDestroy {
  @Input({ required: true }) appCountUp = 0;
  /** Zero-pad to this many digits. */
  @Input() pad = 0;
  @Input() duration = 900;

  private observer?: IntersectionObserver;
  private frame = 0;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      if (prefersReducedMotion()) return;

      this.render(0);
      this.observer = new IntersectionObserver(entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        this.observer?.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / this.duration);
          this.render(Math.round((1 - Math.pow(1 - t, 4)) * this.appCountUp));
          if (t < 1) this.frame = requestAnimationFrame(tick);
        };
        this.frame = requestAnimationFrame(tick);
      }, { threshold: 0.5 });
      this.observer.observe(this.el.nativeElement);
    });
  }

  private render(n: number): void {
    this.el.nativeElement.textContent = String(n).padStart(this.pad, '0');
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frame) cancelAnimationFrame(this.frame);
  }
}
