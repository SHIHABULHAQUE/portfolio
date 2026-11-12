import { Component, OnDestroy, afterNextRender, signal } from '@angular/core';
import { RESUME_DATA } from '../../core/data/resume.data';
import { scrollToId } from '../../shared/utils/scroll';

/** Floating glass navigation. The link for the section on screen lights up. */
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="nav" [class.open]="open()">
      <div class="bar">
        <a class="brand" href="#top" (click)="go($event, 'top')" aria-label="Mohammed Shihabul Haque, back to top">
          <span class="logo">MSH</span>
        </a>

        <nav class="links" aria-label="Primary">
          @for (link of links; track link.id) {
            <a [href]="'#' + link.id" [class.active]="active() === link.id" (click)="go($event, link.id)">{{ link.label }}</a>
          }
        </nav>

        <a class="btn btn-glow talk" href="#contact" (click)="go($event, 'contact')">Let’s talk</a>

        <button class="burger" type="button" (click)="toggle()" [attr.aria-expanded]="open()" aria-controls="menu"
          [attr.aria-label]="open() ? 'Close menu' : 'Open menu'">
          <span></span><span></span>
        </button>
      </div>

      <nav class="menu" id="menu" aria-label="Mobile" [attr.inert]="open() ? null : ''">
        @for (link of links; track link.id; let i = $index) {
          <a [href]="'#' + link.id" [style.--i]="i" (click)="go($event, link.id)">
            <span class="mono">0{{ i + 1 }}</span>{{ link.label }}
          </a>
        }
        <a class="mail mono" [href]="'mailto:' + profile.email">{{ profile.email }}</a>
      </nav>
    </header>
  `,
  styles: [`
    .nav {
      position: fixed;
      inset: 1rem 0 auto 0;
      z-index: 2000;
      padding-inline: var(--gutter);
      display: grid;
      justify-items: center;
      pointer-events: none;
      animation: drop 0.8s var(--ease) 0.2s backwards;
    }
    @keyframes drop { from { opacity: 0; translate: 0 -120%; } }

    .bar, .menu {
      pointer-events: auto;
      border: 1px solid var(--line);
      background: rgba(10, 12, 22, 0.62);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
      backdrop-filter: blur(18px) saturate(160%);
      box-shadow: 0 18px 50px -20px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem;
      border-radius: 999px;
    }

    .brand { display: grid; place-items: center; height: 42px; padding-inline: 0.9rem 0.7rem; }
    .logo {
      font-weight: 700;
      letter-spacing: -0.02em;
      background: var(--grad);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .links { display: flex; }
    .links a {
      position: relative;
      display: grid;
      place-items: center;
      height: 42px;
      padding-inline: 1rem;
      border-radius: 999px;
      font-size: 0.92rem;
      color: var(--mute);
      transition: color 0.2s linear, background-color 0.25s linear;
    }
    .links a:hover { color: var(--text); }
    .links a.active { color: var(--text); background: rgba(255, 255, 255, 0.08); }
    .links a.active::after {
      content: '';
      position: absolute;
      bottom: 5px;
      width: 14px;
      height: 2px;
      border-radius: 2px;
      background: var(--grad);
      box-shadow: 0 0 10px var(--c1);
    }

    .talk { min-height: 42px; padding-inline: 1.15rem; font-size: 0.9rem; margin-left: 0.35rem; }

    .burger { display: none; width: 42px; height: 42px; border-radius: 50%; position: relative; }
    .burger span {
      position: absolute;
      left: 12px;
      right: 12px;
      top: 50%;
      height: 1.5px;
      background: var(--text);
      transition: transform 0.35s var(--ease);
    }
    .burger span:first-child { transform: translateY(-4px); }
    .burger span:last-child { transform: translateY(4px); }
    .open .burger span:first-child { transform: rotate(45deg); }
    .open .burger span:last-child { transform: rotate(-45deg); }

    .menu {
      display: none;
      width: 100%;
      margin-top: 0.6rem;
      padding: 0.6rem;
      border-radius: 24px;
      opacity: 0;
      translate: 0 -0.75rem;
      visibility: hidden;
      transition: opacity 0.25s linear, translate 0.4s var(--ease), visibility 0s 0.3s;
    }
    .open .menu { opacity: 1; translate: 0 0; visibility: visible; transition-delay: 0s; }
    .menu a {
      display: flex;
      align-items: baseline;
      gap: 0.9rem;
      padding: 0.85rem 1rem;
      border-radius: 16px;
      font-size: 1.35rem;
      font-weight: 500;
      letter-spacing: -0.02em;
    }
    .menu a:active { background: rgba(255, 255, 255, 0.07); }
    .menu .mono { color: var(--c1); }
    .menu .mail { margin-top: 0.4rem; border-top: 1px solid var(--line); border-radius: 0; color: var(--mute); font-size: 0.75rem; text-transform: none; }

    @media (max-width: 860px) {
      .bar { width: 100%; justify-content: space-between; }
      .links, .talk { display: none; }
      .burger, .menu { display: block; }
    }
  `]
})
export class HeaderComponent implements OnDestroy {
  profile = RESUME_DATA.profile;
  links = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  open = signal(false);
  active = signal('');

  private cleanup?: () => void;

  constructor() {
    afterNextRender(() => {
      // The active link is whichever section crosses the middle band of the screen
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.active.set(entry.target.id);
        }
      }, { rootMargin: '-45% 0px -50% 0px' });
      this.links.forEach(link => {
        const el = document.getElementById(link.id);
        if (el) observer.observe(el);
      });

      // Back in the hero, no link is active
      const firstSection = document.getElementById(this.links[0].id);
      const onScroll = () => {
        if (this.active() && firstSection && firstSection.getBoundingClientRect().top > window.innerHeight * 0.55) {
          this.active.set('');
        }
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.open.set(false);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('keydown', onKey);
      this.cleanup = () => {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('keydown', onKey);
      };
    });
  }

  toggle(): void {
    this.open.update(value => !value);
  }

  go(event: Event, id: string): void {
    event.preventDefault();
    this.open.set(false);
    scrollToId(id);
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
