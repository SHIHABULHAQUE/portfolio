import { Component, OnDestroy, afterNextRender } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { ExperienceComponent } from './experience/experience.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { EducationComponent } from './education/education.component';
import { StatisticsComponent } from './statistics/statistics.component';
import Lenis from 'lenis';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    StatisticsComponent,
    ExperienceComponent,
    SkillsComponent,
    EducationComponent,
    ProjectsComponent,
    ContactComponent
  ],
  template: `
    <app-hero />

    <div class="container">
      <app-statistics />
      <app-experience />
      <app-skills />
      <app-education />
      <app-projects />
    </div>

    <app-contact />
  `
})
export class HomeComponent implements OnDestroy {
  private lenis: Lenis | null = null;
  private rafId: number | null = null;

  constructor() {
    afterNextRender(() => this.initSmoothScroll());
  }

  ngOnDestroy(): void {
    this.lenis?.destroy();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private initSmoothScroll(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    const raf = (time: number) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }
}
