import { Directive, ElementRef, Input, OnDestroy, afterNextRender } from '@angular/core';

/** Adds `.in` once the element scrolls into view. The motion itself lives in styles.scss (.reveal). */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { class: 'reveal' }
})
export class RevealDirective implements OnDestroy {
  /** Optional delay in seconds. */
  @Input() appReveal: number | '' = '';

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (this.appReveal !== '') node.style.setProperty('--d', `${this.appReveal}s`);

      this.observer = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          node.classList.add('in');
          this.observer?.disconnect();
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
