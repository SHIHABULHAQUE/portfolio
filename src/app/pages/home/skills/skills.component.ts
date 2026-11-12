import { Component } from '@angular/core';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { SpotlightDirective } from '../../../shared/directives/spotlight.directive';

/** Skills: six glass cards, one per discipline, with chips that light up on hover. */
@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealDirective, SpotlightDirective, SectionHeadingComponent],
  template: `
    <section class="section" id="skills">
      <div class="container">
        <app-section-heading index="04" label="Skills" title="A full stack, *front to back.*" />

        <ul class="grid">
          @for (group of groups; track group.title; let i = $index) {
            <li class="card" appSpotlight [tilt]="4" [appReveal]="(i % 3) * 0.07">
              <header>
                <span class="icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                    <path [attr.d]="icons[i % icons.length]" />
                  </svg>
                </span>
                <h3>{{ group.title }}</h3>
                <span class="mono count">{{ group.items.length }}</span>
              </header>
              <ul class="chips">
                @for (item of group.items; track item) {
                  <li class="chip">{{ item }}</li>
                }
              </ul>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
    .card { padding: clamp(1.25rem, 2vw, 1.75rem); }
    header { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.25rem; }
    h3 { font-size: 1.2rem; }
    .count { margin-left: auto; color: var(--mute); }
    .icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      flex: none;
      border-radius: 14px;
      color: var(--c1);
      background: linear-gradient(140deg, rgba(34, 225, 255, 0.16), rgba(123, 97, 255, 0.16));
      border: 1px solid rgba(123, 97, 255, 0.35);
      box-shadow: 0 0 22px -6px var(--c2);
      transition: transform 0.5s var(--ease), box-shadow 0.3s linear;
    }
    .icon svg { width: 22px; height: 22px; }
    .card:hover .icon { transform: rotate(-8deg) scale(1.08); box-shadow: 0 0 30px -4px var(--c1); }
    .chips { display: flex; flex-wrap: wrap; gap: 0.45rem; }
    .chip { color: #c9cddc; }
    @media (max-width: 1040px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 680px) { .grid { grid-template-columns: 1fr; } }
  `]
})
export class SkillsComponent {
  groups = RESUME_DATA.skills;

  /** One line icon per group, in the same order as RESUME_DATA.skills. */
  icons = [
    'M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16', // front-end: code
    'M3 5h18v14H3zM3 10h18M8 10v9', // UI libraries: layout
    'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.700 3.600 3 8 3s8-1.300 8-3V6M4 12c0 1.700 3.600 3 8 3s8-1.300 8-3', // back-end: database
    'M6 3v12M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 9c0 4-4 5-9 6', // devops: branch
    'M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10', // practices: check
    'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-2a4 4 0 0 0-3-3.870M16 2.130a4 4 0 0 1 0 7.750' // leadership: people
  ];
}
