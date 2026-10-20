import { Component, OnDestroy, afterNextRender, signal } from '@angular/core';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { CalligraphyComponent } from '../../../shared/components/calligraphy/calligraphy.component';
import { PhotoRevealComponent } from '../../../shared/components/photo-reveal/photo-reveal.component';
import { gsap } from 'gsap';
import { whenPreloaderDone } from '../../../shared/utils/preloader';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CalligraphyComponent, PhotoRevealComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnDestroy {
  data = RESUME_DATA.profile;

  /** True once the portrait has been revealed — shows the hand-written hello. */
  arrived = signal(false);

  private ctx?: gsap.Context;
  private onPointer?: (e: PointerEvent) => void;

  constructor() {
    afterNextRender(() => this.animate());
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    if (this.onPointer) window.removeEventListener('pointermove', this.onPointer);
  }

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  }

  private animate(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ctx = gsap.context(() => {
      // Built paused so the "from" states apply now, but motion starts once the preloader lifts.
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      whenPreloaderDone().then(() => tl.play());
      tl.from('.disc', { scale: 0.4, opacity: 0, duration: 1.4, ease: 'expo.out' })
        .from('.ring', { opacity: 0, duration: 1.2 }, 0.5)
        .from('.chip', { opacity: 0, scale: 0.7, y: 20, duration: 0.9, stagger: 0.15, ease: 'back.out(1.8)' }, 1.4)
        .from('.hero-eyebrow, .name-first', { opacity: 0, y: 24, duration: 1, stagger: 0.12 }, 0.4)
        .to('.flourish path', { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 2.6)
        .from('.hero-role, .hero-summary, .hero-actions, .hero-meta li', { opacity: 0, y: 22, duration: 0.9, stagger: 0.1 }, 2.2)
        .from('.badge, .badge-core', { opacity: 0, scale: 0.6, duration: 1, ease: 'back.out(1.6)' }, 2.6)
        .from('.scroll-cue', { opacity: 0, duration: 1 }, 3.4);
    });

    // Depth parallax: each layer drifts with the pointer by its data-depth
    const layers = Array.from(document.querySelectorAll<HTMLElement>('.hero-visual .layer')).map(el => ({
      depth: Number(el.dataset['depth'] ?? 1),
      x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' })
    }));
    this.onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      layers.forEach(l => {
        l.x(dx * 14 * l.depth);
        l.y(dy * 10 * l.depth);
      });
    };
    window.addEventListener('pointermove', this.onPointer, { passive: true });
  }
}
