import { Component, HostListener, OnDestroy, afterNextRender, signal } from '@angular/core';

interface NavLink {
  id: string;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header [class.scrolled]="isScrolled()" [class.menu-open]="isMenuOpen()">
      <div class="bar">
        <a href="#hero" class="logo" (click)="scrollToSection($event, 'hero')" aria-label="Back to top">Shihab</a>

        <nav [class.active]="isMenuOpen()" aria-label="Primary">
          @for (link of links; track link.id; let i = $index) {
            <a [href]="'#' + link.id"
               [class.active]="activeSection() === link.id"
               (click)="scrollToSection($event, link.id)">
              <sup>0{{ i + 1 }}</sup>{{ link.label }}
            </a>
          }
          <a class="cta" href="assets/resume.pdf" download>Résumé</a>
        </nav>

        <button class="toggle" (click)="isMenuOpen.set(!isMenuOpen())" [attr.aria-expanded]="isMenuOpen()" aria-label="Toggle menu">
          <span></span><span></span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    header {
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 1000;
      padding: 1.4rem 0;
      transition: padding 0.5s var(--ease), background 0.5s var(--ease), box-shadow 0.5s var(--ease);
    }
    header.scrolled {
      padding: 0.7rem 0;
      background: rgba(244, 239, 230, 0.82);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 1px 0 var(--line);
    }
    .bar {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-family: var(--font-script);
      font-size: 2.3rem;
      line-height: 1;
      color: var(--ink);
      text-decoration: none;
      transition: color 0.3s;
    }
    .logo:hover { color: var(--moss); }

    nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    nav a {
      position: relative;
      font-size: 0.86rem;
      font-weight: 500;
      color: var(--ink-soft);
      text-decoration: none;
      transition: color 0.3s;
    }
    nav a sup {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 0.7rem;
      color: var(--sand);
      margin-right: 0.25rem;
    }
    nav a:not(.cta)::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -4px;
      height: 1px;
      background: var(--ink);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.5s var(--ease);
    }
    nav a:hover, nav a.active { color: var(--ink); }
    nav a:hover::after, nav a.active::after {
      transform: scaleX(1);
      transform-origin: left;
    }
    .cta {
      padding: 0.55rem 1.2rem;
      border-radius: 999px;
      border: 1px solid var(--line-strong);
      color: var(--ink) !important;
      transition: background 0.3s, color 0.3s !important;
    }
    .cta:hover {
      background: var(--ink);
      color: var(--paper) !important;
    }

    .toggle {
      display: none;
      width: 32px;
      height: 32px;
      background: none;
      border: none;
      cursor: pointer;
      position: relative;
      z-index: 2;
    }
    .toggle span {
      position: absolute;
      left: 4px;
      right: 4px;
      height: 1.5px;
      background: var(--ink);
      transition: transform 0.4s var(--ease), top 0.4s var(--ease);
    }
    .toggle span:first-child { top: 12px; }
    .toggle span:last-child { top: 19px; }
    .menu-open .toggle span:first-child { top: 15px; transform: rotate(45deg); }
    .menu-open .toggle span:last-child { top: 15px; transform: rotate(-45deg); }

    @media (max-width: 860px) {
      .bar { padding: 0 1.25rem; }
      .toggle { display: block; }
      /* backdrop-filter would make the fixed menu relative to the header */
      header.menu-open {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
      nav {
        position: fixed;
        inset: 0;
        flex-direction: column;
        justify-content: center;
        gap: 1.6rem;
        background: var(--paper);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s var(--ease), visibility 0.5s;
      }
      nav.active {
        opacity: 1;
        visibility: visible;
      }
      nav a {
        font-family: var(--font-serif);
        font-size: 2.2rem;
        color: var(--ink);
      }
      .cta { font-family: var(--font-body) !important; font-size: 1rem !important; }
    }
  `]
})
export class HeaderComponent implements OnDestroy {
  links: NavLink[] = [
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Work' },
    { id: 'contact', label: 'Contact' }
  ];

  isScrolled = signal(false);
  isMenuOpen = signal(false);
  activeSection = signal('hero');

  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => this.observeSections());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 40);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    this.isMenuOpen.set(false);
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    this.activeSection.set(id);
  }

  private observeSections(attempt = 0): void {
    // Home is lazy-loaded, so its sections may not be in the DOM yet.
    if (!document.getElementById('contact')) {
      if (attempt < 20) setTimeout(() => this.observeSections(attempt + 1), 250);
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) this.activeSection.set(entry.target.id);
      });
    }, { rootMargin: '-35% 0px -60% 0px' });

    ['hero', ...this.links.map(l => l.id)].forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer!.observe(el);
    });
  }
}
