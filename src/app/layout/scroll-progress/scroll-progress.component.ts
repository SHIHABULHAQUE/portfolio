import { Component } from '@angular/core';

/** Reading progress along the top edge. Pure CSS scroll-driven animation: no script, no listeners. */
@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `<div class="bar" aria-hidden="true"></div>`,
  styles: [`
    .bar { display: none; }
    @supports (animation-timeline: scroll()) {
      .bar {
        display: block;
        position: fixed;
        inset: 0 0 auto 0;
        z-index: 2500;
        height: 2px;
        background: var(--grad);
        box-shadow: 0 0 12px rgba(123, 97, 255, 0.9);
        transform-origin: left;
        animation: grow linear both;
        animation-timeline: scroll(root);
      }
    }
    @keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @media (prefers-reduced-motion: reduce) { .bar { display: none; } }
  `]
})
export class ScrollProgressComponent {}
