import { Directive, ElementRef, Input, OnDestroy, afterNextRender } from '@angular/core';

/** Fades/slides an element in once it scrolls into view. Styles live in styles.scss (.reveal). */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { class: 'reveal' }
})
export class RevealDirective implements OnDestroy {
  /** Optional stagger delay in seconds. */
  @Input() appReveal: number | '' = '';

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (this.appReveal !== '') node.style.setProperty('--reveal-delay', `${this.appReveal}s`);

      this.observer = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          node.classList.add('in');
          this.observer?.disconnect();
        }
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
