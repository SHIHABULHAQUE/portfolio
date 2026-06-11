import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeroComponent } from './hero/hero.component';
import { ExperienceComponent } from './experience/experience.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { EducationComponent } from './education/education.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ThreeBackgroundComponent } from '../../shared/components/three-background/three-background.component';
import { GravityParticlesComponent } from '../../shared/components/gravity-particles/gravity-particles.component';
import { ThemeService, AccentColor } from '../../core/services/theme.service';
import Lenis from 'lenis';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ThreeBackgroundComponent,
    GravityParticlesComponent,
    HeroComponent,
    StatisticsComponent,
    ExperienceComponent,
    SkillsComponent,
    EducationComponent,
    ProjectsComponent,
    ContactComponent
  ],
  template: `
    <!-- Multi-Layered Weightless Visual Backdrops -->
    <app-three-background></app-three-background>
    <app-gravity-particles></app-gravity-particles>

    <!-- Floating Interactive Color Shifter Pinned to Edge -->
    <div class="accent-controller glass-panel">
      <span class="control-label">SPECTRUM</span>
      <div class="color-row">
        @for (color of accentOptions; track color) {
          <button class="color-selector-btn" 
                  [style.background]="color"
                  [class.active]="themeService.activeAccent() === color"
                  (click)="themeService.setAccent(color)"
                  [attr.aria-label]="'Switch accent to ' + color">
          </button>
        }
      </div>
    </div>

    <!-- Global Aurora blobs (governed by CSS variables) -->
    <div class="aurora-bg">
      <div class="aurora-blob cyan"></div>
      <div class="aurora-blob purple"></div>
      <div class="aurora-blob mint"></div>
    </div>

    <!-- Asymmetrical Structure -->
    <app-hero id="hero"></app-hero>
    
    <div class="container">
      <app-statistics></app-statistics>
      <app-experience id="experience"></app-experience>
      <app-skills id="skills"></app-skills>
      <app-education id="education"></app-education>
      <app-projects id="projects"></app-projects>
      <app-contact id="contact"></app-contact>
    </div>
  `,
  styles: [`
    /* Accent Spectrum Controller Pinned Lower Left */
    .accent-controller {
      position: fixed;
      left: 2.2rem;
      bottom: 2.2rem;
      z-index: 1000;
      padding: 0.6rem 1rem;
      border-radius: 30px;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      background: rgba(10, 15, 26, 0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.07);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
      
      @media (max-width: 768px) {
        left: 50%;
        bottom: 1rem;
        transform: translateX(-50%);
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        width: auto;
      }
    }

    .control-label {
      font-family: var(--font-heading);
      font-size: 0.55rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: var(--text-muted);
      text-transform: uppercase;
      text-align: center;
      
      @media (max-width: 768px) {
        text-align: left;
      }
    }

    .color-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .color-selector-btn {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      padding: 0;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s;
      
      &:hover {
        transform: scale(1.3);
        border-color: #ffffff;
      }
      
      &.active {
        transform: scale(1.35);
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px var(--primary);
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  accentOptions: AccentColor[] = ['#00f0ff', '#bd00ff', '#64ffda', '#ff5e00'];
  
  private lenis: Lenis | null = null;
  private rafId: number | null = null;

  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSmoothScroll();
    }
  }

  ngOnDestroy(): void {
    if (this.lenis) {
      this.lenis.destroy();
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  private initSmoothScroll(): void {
    this.lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false
    });

    const raf = (time: number) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }
}
