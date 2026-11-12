import { Directive, ElementRef, Input, NgZone, OnDestroy, afterNextRender } from '@angular/core';

/**
 * Tracks the pointer over a card: exposes --mx/--my (px) for a gold spotlight
 * and, when `tilt` > 0, --rx/--ry (deg) for a gentle 3D tilt.
 * Only runs on devices with a fine, hovering pointer and without reduced motion.
 */
@Directive({
  selector: '[appSpotlight]',
  standalone: true,
  host: { class: 'spotlight' }
})
export class SpotlightDirective implements OnDestroy {
  /** Maximum tilt in degrees; 0 disables tilt. */
  @Input() tilt = 0;

  private frame = 0;
  private cleanup?: () => void;

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {
    afterNextRender(() => {
      const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!fine) return;

      const node = this.el.nativeElement;
      const move = (e: PointerEvent) => {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => {
          const r = node.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          node.style.setProperty('--mx', `${x}px`);
          node.style.setProperty('--my', `${y}px`);
          if (this.tilt && !reduce) {
            node.style.setProperty('--rx', `${((x / r.width) - 0.5) * this.tilt * 2}deg`);
            node.style.setProperty('--ry', `${(0.5 - (y / r.height)) * this.tilt * 2}deg`);
          }
        });
      };
      const leave = () => {
        cancelAnimationFrame(this.frame);
        node.style.setProperty('--rx', '0deg');
        node.style.setProperty('--ry', '0deg');
      };

      this.zone.runOutsideAngular(() => {
        node.addEventListener('pointermove', move, { passive: true });
        node.addEventListener('pointerleave', leave);
      });
      this.cleanup = () => {
        node.removeEventListener('pointermove', move);
        node.removeEventListener('pointerleave', leave);
      };
    });
  }

  ngOnDestroy(): void {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.cleanup?.();
  }
}
