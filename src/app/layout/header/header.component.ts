import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header [class.scrolled]="isScrolled">
      <div class="container header-content">
        <a routerLink="/" class="logo bracket-text">
          Shihab
        </a>

        <button class="mobile-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
          <span [class.open]="isMenuOpen"></span>
          <span [class.open]="isMenuOpen"></span>
          <span [class.open]="isMenuOpen"></span>
        </button>

        <nav [class.active]="isMenuOpen">
          <a href="#hero" (click)="closeMenu()">Home</a>
          <a href="#experience" (click)="closeMenu()">Experience</a>
          <a href="#skills" (click)="closeMenu()">Skills</a>
          <a href="#projects" (click)="closeMenu()">Projects</a>
          <a href="#contact" (click)="closeMenu()">Contact</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      transition: all 0.3s ease;
      padding: 1.5rem 0;
      background: rgba(11, 14, 20, 0.85); /* Dark Navy transparent */
      backdrop-filter: blur(10px);
    }

    header.scrolled {
      padding: 1rem 0;
      box-shadow: 0 10px 30px -10px rgba(2, 12, 27, 0.7);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 0.05em;
    }
    
    /* Override bracket-text for logo if needed, but it works well */
    .logo.bracket-text::before { content: '< '; color: var(--primary); }
    .logo.bracket-text::after { content: ' />'; color: var(--primary); }

    nav {
      display: flex;
      gap: 2.5rem;
      align-items: center;
    }

    nav a {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-main);
      position: relative;
    }

    nav a:hover {
      color: var(--primary);
    }

    /* Numbered nav items like "01. About" is a nice touch if desired, but sticking to clean text for now */

    .mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 6px;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 1001;
    }

    .mobile-toggle span {
      display: block;
      width: 25px;
      height: 2px;
      background-color: var(--primary);
      transition: all 0.3s;
    }

    @media (max-width: 768px) {
      .mobile-toggle {
        display: flex;
      }

      nav {
        position: fixed;
        top: 0;
        right: -100%;
        width: 75%;
        height: 100vh;
        background: var(--bg-card);
        flex-direction: column;
        justify-content: center;
        transition: right 0.3s ease;
        box-shadow: -10px 0 30px rgba(0,0,0,0.5);
      }

      nav.active {
        right: 0;
      }
    }
  `]
})
export class HeaderComponent {
  isScrolled = false;
  isMenuOpen = false;

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
