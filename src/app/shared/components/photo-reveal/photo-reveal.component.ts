import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { whenPreloaderDone } from '../../utils/preloader';

/**
 * Hero portrait as an illustration made from Shihab's walking photo.
 * Two layers generated from the photo:
 *   - ink:  line art, drawn top-to-bottom like a pen sketch
 *   - toon: cel-shaded cartoon colouring that washes up from the ground
 * Clicking the illustration draws it again.
 */
@Component({
  selector: 'app-photo-reveal',
  standalone: true,
  template: `
    <div #stage class="stage" (click)="replay()" title="Click to redraw">
      <span class="shadow" aria-hidden="true"></span>
      <img #ink class="ink" src="assets/images/shihab-walk-ink.webp" alt="" draggable="false" />
      <img #toon class="toon" src="assets/images/shihab-walk-toon.webp" draggable="false"
           alt="Illustration of Mohammed Shihabul Haque walking through the grass" />
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      height: 100%;
    }
    .stage {
      position: relative;
      height: 100%;
      aspect-ratio: 380 / 1032;
      transform-origin: 50% 100%;
      /* on the wrapper, not the masked image — a masked drop-shadow gets clipped to a hard box */
      filter: drop-shadow(0 18px 24px rgba(28, 42, 33, 0.28));
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .stage img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      user-select: none;
    }
    /* Pen sketch: drawn downward; --draw animates 0% → 115% */
    .ink {
      --draw: 115%;
      -webkit-mask-image: linear-gradient(to bottom, #000 calc(var(--draw) - 10%), transparent var(--draw));
      mask-image: linear-gradient(to bottom, #000 calc(var(--draw) - 10%), transparent var(--draw));
    }
    /* Colour wash: rises from the ground; --wash animates 0% → 120% */
    .toon {
      --wash: 120%;
      -webkit-mask-image: linear-gradient(to top, #000 calc(var(--wash) - 20%), transparent var(--wash));
      mask-image: linear-gradient(to top, #000 calc(var(--wash) - 20%), transparent var(--wash));
    }
    .shadow {
      position: absolute;
      left: 50%;
      bottom: -1.2%;
      width: 120%;
      height: 4%;
      translate: -50% 0;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(28, 42, 33, 0.4), transparent 70%);
    }
  `]
})
export class PhotoRevealComponent implements OnDestroy {
  /** Fires once the illustration has been drawn and painted. */
  @Output() arrived = new EventEmitter<void>();

  @ViewChild('stage', { static: true }) stage!: ElementRef<HTMLElement>;
  @ViewChild('ink', { static: true }) ink!: ElementRef<HTMLImageElement>;
  @ViewChild('toon', { static: true }) toon!: ElementRef<HTMLImageElement>;

  private reduced = false;
  private tl?: gsap.core.Timeline;

  constructor() {
    afterNextRender(async () => {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (this.reduced) {
        this.arrived.emit();
        return;
      }

      this.hideLayers();
      await Promise.all([
        whenPreloaderDone(),
        this.ink.nativeElement.decode().catch(() => undefined),
        this.toon.nativeElement.decode().catch(() => undefined)
      ]);
      this.drawIn(1.5, 0.3).call(() => this.arrived.emit());
    });
  }

  ngOnDestroy(): void {
    this.tl?.kill();
  }

  replay(): void {
    if (this.reduced || this.tl?.isActive()) return;
    this.hideLayers();
    this.drawIn(1, 0.1);
  }

  /** Ink sketch drawn top-to-bottom, then the cartoon colour washes up over it. */
  private drawIn(speed: number, delay: number): gsap.core.Timeline {
    this.tl = gsap.timeline({ delay })
      .to(this.ink.nativeElement, { '--draw': '115%', duration: 1.3 * speed, ease: 'power1.inOut' }, 0)
      .to(this.toon.nativeElement, { '--wash': '120%', duration: 1.2 * speed, ease: 'power2.inOut' }, 0.95 * speed)
      .fromTo(this.stage.nativeElement, { scale: 1.015 }, { scale: 1, duration: 1.8 * speed, ease: 'power2.out' }, 0);
    return this.tl;
  }

  private hideLayers(): void {
    gsap.set(this.ink.nativeElement, { '--draw': '0%' });
    gsap.set(this.toon.nativeElement, { '--wash': '0%' });
  }
}
