import { Directive, ElementRef, Input, OnDestroy, afterNextRender } from '@angular/core';
import { hasFinePointer, prefersReducedMotion } from '../utils/ticker';

/**
 * Pulls an element toward the pointer while hovered, then springs it back.
 * Writes the `translate` property so it never fights `transform` or the press `scale`.
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true
})
export class MagneticDirective implements OnDestroy {
  /** Fraction of the pointer offset to follow. */
  @Input() appMagnetic: number | '' = '';

  private cleanup?: () => void;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      if (!hasFinePointer() || prefersReducedMotion()) return;

      const node = this.el.nativeElement;
      const strength = this.appMagnetic === '' ? 0.3 : this.appMagnetic;

      const move = (e: PointerEvent) => {
        const r = node.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        node.style.transition = 'translate 0.18s ease-out';
        node.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      };
      const leave = () => {
        // Overshoot on the way home
        node.style.transition = 'translate 0.7s cubic-bezier(0.34, 1.8, 0.5, 1)';
        node.style.translate = '0 0';
      };

      node.addEventListener('pointermove', move, { passive: true });
      node.addEventListener('pointerleave', leave);
      this.cleanup = () => {
        node.removeEventListener('pointermove', move);
        node.removeEventListener('pointerleave', leave);
      };
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
