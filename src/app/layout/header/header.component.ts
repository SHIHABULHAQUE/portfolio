import { Component, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header [class.scrolled]="isScrolled" [class.menu-open]="isMenuOpen">
      <div class="header-container">
        <!-- Logo -->
        <a routerLink="/" class="logo bracket-text">
          <span>SHIHAB</span>
        </a>

        <!-- Mobile Hamburg Menu -->
        <button class="mobile-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
          <span [class.open]="isMenuOpen"></span>
          <span [class.open]="isMenuOpen"></span>
          <span [class.open]="isMenuOpen"></span>
        </button>

        <!-- Navigation links -->
        <nav [class.active]="isMenuOpen">
          <a #navLink href="#hero" 
             [class.active]="activeSection === 'hero'" 
             (click)="scrollToSection($event, 'hero')"
             (mousemove)="onMagneticMove($event)"
             (mouseleave)="onMagneticLeave($event)">
             <span>Home</span>
          </a>
          <a #navLink href="#experience" 
             [class.active]="activeSection === 'experience'" 
             (click)="scrollToSection($event, 'experience')"
             (mousemove)="onMagneticMove($event)"
             (mouseleave)="onMagneticLeave($event)">
             <span>Experience</span>
          </a>
          <a #navLink href="#skills" 
             [class.active]="activeSection === 'skills'" 
             (click)="scrollToSection($event, 'skills')"
             (mousemove)="onMagneticMove($event)"
             (mouseleave)="onMagneticLeave($event)">
             <span>Skills</span>
          </a>
          <a #navLink href="#projects" 
             [class.active]="activeSection === 'projects'" 
             (click)="scrollToSection($event, 'projects')"
             (mousemove)="onMagneticMove($event)"
             (mouseleave)="onMagneticLeave($event)">
             <span>Projects</span>
          </a>
          <a #navLink href="#contact" 
             [class.active]="activeSection === 'contact'" 
             (click)="scrollToSection($event, 'contact')"
             (mousemove)="onMagneticMove($event)"
             (mouseleave)="onMagneticLeave($event)">
             <span>Contact</span>
          </a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    header {
      position: fixed;
      top: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 850px;
      z-index: 1000;
      border-radius: 40px;
      background: rgba(10, 15, 26, 0.4);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
      padding: 0.6rem 2rem;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    header.scrolled {
      top: 1rem;
      background: rgba(5, 7, 10, 0.7);
      border-color: rgba(0, 240, 255, 0.25);
      box-shadow: 0 20px 50px rgba(0, 240, 255, 0.08);
      max-width: 800px;
    }

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-family: var(--font-heading);
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #ffffff;
      text-decoration: none;
      transition: text-shadow 0.3s;
    }

    .logo.bracket-text::before { content: '< '; color: var(--primary); }
    .logo.bracket-text::after { content: ' />'; color: var(--primary); }
    
    .logo:hover {
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
    }

    nav {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    nav a {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-decoration: none;
      padding: 0.6rem 1.1rem;
      border-radius: 20px;
      transition: color 0.3s;
      position: relative;
      display: inline-block;
      
      span {
        position: relative;
        z-index: 2;
        pointer-events: none;
      }
    }

    nav a.active {
      color: var(--primary);
      background: rgba(0, 240, 255, 0.08);
      box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.05);
      
      &::after {
        content: '';
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 2px;
        background: var(--primary);
        border-radius: 2px;
        box-shadow: 0 0 8px var(--primary);
      }
    }

    nav a:hover:not(.active) {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.03);
    }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 24px;
      height: 18px;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 1001;
      padding: 0;
    }

    .mobile-toggle span {
      display: block;
      width: 100%;
      height: 2px;
      background-color: #ffffff;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: left center;
    }

    .mobile-toggle span.open:nth-child(1) {
      transform: rotate(45deg);
      background-color: var(--primary);
    }

    .mobile-toggle span.open:nth-child(2) {
      width: 0%;
      opacity: 0;
    }

    .mobile-toggle span.open:nth-child(3) {
      transform: rotate(-45deg);
      background-color: var(--primary);
    }

    @media (max-width: 768px) {
      header {
        top: 1rem;
        width: 92%;
        border-radius: 24px;
        padding: 0.8rem 1.5rem;
      }
      
      header.menu-open {
        border-radius: 24px 24px 0 0;
        background: rgba(5, 7, 10, 0.98);
        border-bottom-color: transparent;
      }

      .mobile-toggle {
        display: flex;
      }

      nav {
        position: absolute;
        top: 100%;
        left: -1px;
        width: calc(100% + 2px);
        background: rgba(5, 7, 10, 0.98);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-top: none;
        border-radius: 0 0 24px 24px;
        flex-direction: column;
        align-items: stretch;
        padding: 1.5rem;
        gap: 0.75rem;
        transform: translateY(-20px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }

      nav.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      nav a {
        text-align: center;
        padding: 0.8rem;
        border-radius: 12px;
        font-size: 0.95rem;
      }
      
      nav a.active::after {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMenuOpen = false;
  activeSection = 'hero';
  private observer!: IntersectionObserver;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 50;
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  // Smooth Scroll Trigger
  scrollToSection(event: Event, targetId: string) {
    event.preventDefault();
    this.closeMenu();
    
    if (isPlatformBrowser(this.platformId)) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        this.activeSection = targetId;
      }
    }
  }

  // Magnetic button hover animation
  onMagneticMove(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      const link = event.currentTarget as HTMLElement;
      const rect = link.getBoundingClientRect();
      
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      gsap.to(link, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }

  onMagneticLeave(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      const link = event.currentTarget as HTMLElement;
      
      gsap.to(link, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1.1, 0.4)'
      });
    }
  }

  // Track scroll section entries
  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    const sections = ['hero', 'experience', 'skills', 'projects', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        this.observer.observe(el);
      }
    });
  }
}
