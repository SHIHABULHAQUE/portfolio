import { Component, ElementRef, OnDestroy, ViewChild, afterNextRender } from '@angular/core';
import { hasFinePointer, prefersReducedMotion } from '../../shared/utils/ticker';

/**
 * Pointer light: a wide, soft glow that trails the cursor across the page, plus a small ring
 * that swells over links and buttons. The native cursor is left alone.
 */
@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `
    <div class="glow" #glow aria-hidden="true"></div>
    <div class="ring" #ring aria-hidden="true"></div>
  `,
  styles: [`
    .glow, .ring {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.4s linear;
    }
    .glow {
      z-index: 0;
      width: 640px;
      height: 640px;
      margin: -320px 0 0 -320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(123, 97, 255, 0.16), rgba(34, 225, 255, 0.05) 40%, transparent 65%);
      will-change: translate;
    }
    .ring {
      z-index: 3000;
      width: 36px;
      height: 36px;
      margin: -18px 0 0 -18px;
      border-radius: 50%;
      border: 1.5px solid rgba(34, 225, 255, 0.8);
      box-shadow: 0 0 18px rgba(34, 225, 255, 0.45);
      transition: opacity 0.4s linear, scale 0.3s var(--ease), border-color 0.3s linear, background-color 0.3s linear;
      will-change: translate, scale;
    }
    .on { opacity: 1; }
    .ring.link { scale: 1.7; border-color: rgba(255, 77, 157, 0.9); background: rgba(255, 77, 157, 0.08); box-shadow: 0 0 22px rgba(255, 77, 157, 0.5); }
    @media not ((hover: hover) and (pointer: fine)) { .glow, .ring { display: none; } }
  `]
})
export class CursorComponent implements OnDestroy {
  @ViewChild('glow', { static: true }) glow!: ElementRef<HTMLElement>;
  @ViewChild('ring', { static: true }) ring!: ElementRef<HTMLElement>;

  private cleanup?: () => void;

  constructor() {
    afterNextRender(() => {
      if (!hasFinePointer() || prefersReducedMotion()) return;

      const glow = this.glow.nativeElement;
      const ring = this.ring.nativeElement;
      let tx = 0, ty = 0, rx = 0, ry = 0, gx = 0, gy = 0, frame = 0, seen = false;

      const render = () => {
        // The ring keeps up; the glow drifts behind it
        rx += (tx - rx) * 0.28;
        ry += (ty - ry) * 0.28;
        gx += (tx - gx) * 0.09;
        gy += (ty - gy) * 0.09;
        ring.style.translate = `${rx.toFixed(1)}px ${ry.toFixed(1)}px`;
        glow.style.translate = `${gx.toFixed(1)}px ${gy.toFixed(1)}px`;
        frame = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.3 ? requestAnimationFrame(render) : 0;
      };

      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        tx = e.clientX;
        ty = e.clientY;
        if (!seen) {
          seen = true;
          rx = gx = tx;
          ry = gy = ty;
          glow.classList.add('on');
          ring.classList.add('on');
        }
        if (!frame) frame = requestAnimationFrame(render);
      };

      const over = (e: PointerEvent) => {
        const target = e.target as Element | null;
        ring.classList.toggle('link', !!target?.closest('a, button, input, textarea'));
      };

      const out = () => ring.classList.remove('on');
      const back = () => {
        if (seen) ring.classList.add('on');
      };

      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerover', over, { passive: true });
      document.documentElement.addEventListener('pointerleave', out);
      document.documentElement.addEventListener('pointerenter', back);
      this.cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerover', over);
        document.documentElement.removeEventListener('pointerleave', out);
        document.documentElement.removeEventListener('pointerenter', back);
      };
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
