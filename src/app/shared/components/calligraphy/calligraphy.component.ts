import { Component, ElementRef, Input, OnDestroy, ViewChild, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { whenPreloaderDone } from '../../utils/preloader';

let uid = 0;

/**
 * Writes a word in a script font as if drawn with a pen:
 * the outline is inked stroke-by-stroke while a soft-edged mask
 * sweeps left to right, then the letterforms fill with ink.
 */
@Component({
  selector: 'app-calligraphy',
  standalone: true,
  template: `
    <svg #svg role="img" [attr.aria-label]="text" viewBox="0 -90 400 130" preserveAspectRatio="xMinYMid meet">
      <defs>
        <linearGradient [attr.id]="gradId" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#fff" />
          <stop offset="0.78" stop-color="#fff" />
          <stop offset="1" stop-color="#000" />
        </linearGradient>
        <!-- Explicit region: the default (-10%/120%) clips tall script ascenders -->
        <mask [attr.id]="maskId" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000">
          <rect #sweep x="-2000" y="-400" width="4000" height="800" [attr.fill]="'url(#' + gradId + ')'" />
        </mask>
      </defs>
      <g [attr.mask]="'url(#' + maskId + ')'">
        <text #fill class="c-fill" x="0" y="0">{{ text }}</text>
        <text #stroke class="c-stroke" x="0" y="0">{{ text }}</text>
      </g>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      height: 1em;
      line-height: 0;
      color: var(--ink);
    }
    svg {
      height: 100%;
      width: auto;
      overflow: visible;
    }
    text {
      font-family: var(--font-script);
      font-size: 100px;
    }
    .c-fill {
      fill: currentColor;
    }
    .c-stroke {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `]
})
export class CalligraphyComponent implements OnDestroy {
  @Input({ required: true }) text = '';
  /** 'load' writes immediately, 'view' waits until scrolled into view. */
  @Input() trigger: 'load' | 'view' = 'view';
  @Input() delay = 0;
  /** Seconds per character — longer words take proportionally longer to write. */
  @Input() pace = 0.22;

  @ViewChild('svg', { static: true }) svg!: ElementRef<SVGSVGElement>;
  @ViewChild('fill', { static: true }) fill!: ElementRef<SVGTextElement>;
  @ViewChild('stroke', { static: true }) stroke!: ElementRef<SVGTextElement>;
  @ViewChild('sweep', { static: true }) sweep!: ElementRef<SVGRectElement>;

  readonly gradId = `calli-grad-${++uid}`;
  readonly maskId = `calli-mask-${uid}`;

  private observer?: IntersectionObserver;
  private timeline?: gsap.core.Timeline;
  private box = { x: 0, y: -90, w: 400, h: 130 };

  constructor(private host: ElementRef<HTMLElement>) {
    afterNextRender(() => this.init());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.timeline?.kill();
  }

  private async init(): Promise<void> {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hide ink before the font arrives so nothing flashes.
    if (!reduced) this.setInitialState();

    try {
      await document.fonts.load('100px "Great Vibes"', this.text);
    } catch {
      /* fall back to whatever font rendered */
    }
    this.fitViewBox();

    if (reduced) {
      this.sweep.nativeElement.setAttribute('x', String(this.box.x - 10));
      return;
    }

    this.setInitialState();

    if (this.trigger === 'load') {
      await whenPreloaderDone();
      this.play();
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        this.observer?.disconnect();
        this.play();
      }
    }, { threshold: 0.35 });
    this.observer.observe(this.host.nativeElement);
  }

  private fitViewBox(): void {
    const bb = this.stroke.nativeElement.getBBox();
    if (!bb.width) return;
    const padX = bb.height * 0.12;
    const padY = bb.height * 0.1;
    this.box = { x: bb.x - padX, y: bb.y - padY, w: bb.width + padX * 2, h: bb.height + padY * 2 };
    this.svg.nativeElement.setAttribute('viewBox', `${this.box.x} ${this.box.y} ${this.box.w} ${this.box.h}`);

    const rect = this.sweep.nativeElement;
    rect.setAttribute('y', String(this.box.y - this.box.h));
    rect.setAttribute('height', String(this.box.h * 3));
    rect.setAttribute('width', String(this.box.w * 1.3));
  }

  private setInitialState(): void {
    gsap.set(this.sweep.nativeElement, { attr: { x: this.box.x - this.box.w * 1.3 } });
    gsap.set(this.stroke.nativeElement, { strokeDasharray: 1400, strokeDashoffset: 1400 });
    gsap.set(this.fill.nativeElement, { opacity: 0 });
  }

  private play(): void {
    const duration = Math.min(4.2, Math.max(1.4, this.text.length * this.pace));

    this.timeline = gsap.timeline({ delay: this.delay })
      .to(this.sweep.nativeElement, { attr: { x: this.box.x }, duration, ease: 'power1.inOut' }, 0)
      .to(this.stroke.nativeElement, { strokeDashoffset: 0, duration: duration * 1.15, ease: 'power1.inOut' }, 0)
      .to(this.fill.nativeElement, { opacity: 1, duration: 1.1, ease: 'power2.out' }, duration * 0.6);
  }
}
