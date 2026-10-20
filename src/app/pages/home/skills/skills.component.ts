import { Component } from '@angular/core';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective],
  template: `
    <section class="section" id="skills">
      <app-section-heading index="02" eyebrow="What I work with" title="Craft" script="& tools" />

      <div class="groups">
        @for (group of groups; track group.title; let i = $index) {
          <article class="group" [appReveal]="i * 0.08">
            <span class="num">{{ '0' + (i + 1) }}</span>
            <h3>{{ group.title }}</h3>
            <p class="note">{{ group.note }}</p>
            <ul>
              @for (item of group.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </article>
        }
      </div>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="track">
        @for (pass of [0, 1]; track pass) {
          @for (skill of allSkills; track skill) {
            <span class="m-item">{{ skill }}</span>
            <span class="m-dot">✦</span>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .group {
      position: relative;
      padding: 2.2rem 2rem 2rem;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: rgba(255, 255, 255, 0.35);
      transition: border-color 0.4s var(--ease), background 0.4s var(--ease), transform 0.5s var(--ease) !important;

      &:hover {
        border-color: var(--sand);
        background: rgba(255, 255, 255, 0.6);
      }
    }
    .num {
      position: absolute;
      top: 1.4rem;
      right: 1.6rem;
      font-family: var(--font-serif);
      font-style: italic;
      color: var(--ink-faint);
    }
    h3 {
      font-size: 1.8rem;
      margin-bottom: 0.3rem;
    }
    .note {
      font-family: var(--font-script);
      font-size: 1.45rem;
      color: var(--moss);
      line-height: 1.2;
      margin-bottom: 1.4rem;
    }
    ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    li {
      font-size: 0.82rem;
      font-weight: 500;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      border: 1px solid var(--line);
      color: var(--ink-2);
      background: var(--paper);
    }

    .marquee {
      margin: 0 calc(50% - 50vw);
      overflow: hidden;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      padding: 1.4rem 0;
      background: var(--paper-2);
    }
    .track {
      display: flex;
      align-items: center;
      gap: 2.2rem;
      width: max-content;
      animation: marquee 70s linear infinite;
    }
    .m-item {
      font-family: var(--font-script);
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.2;
      color: var(--ink);
      white-space: nowrap;
    }
    .m-dot {
      color: var(--sand);
      font-size: 0.9rem;
    }
    @keyframes marquee {
      to { transform: translateX(-50%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .track { animation: none; }
    }
  `]
})
export class SkillsComponent {
  allSkills = RESUME_DATA.skills;

  groups = [
    {
      title: 'Front-end',
      note: 'where I live',
      items: ['Angular (v2-18)', 'TypeScript', 'JavaScript', 'RxJS', 'NgRx', 'HTML5', 'CSS3/SCSS']
    },
    {
      title: 'UI Libraries',
      note: 'polished interfaces',
      items: ['Angular Material', 'PrimeNG', 'Ant Design', 'Syncfusion', 'Bootstrap']
    },
    {
      title: 'Back-end & Data',
      note: 'solid foundations',
      items: ['Dot Net', 'SQL', 'Jasper Reports']
    },
    {
      title: 'Delivery',
      note: 'shipping with care',
      items: ['Azure DevOps', 'Git/GitLab', 'CI/CD Pipeline', 'Jira', 'Unit Testing', 'Performance Monitoring']
    },
    {
      title: 'Leadership',
      note: 'people first',
      items: ['Team Leadership', 'Agile/Scrum', 'Mentoring', 'Technical Roadmaps']
    }
  ];
}
