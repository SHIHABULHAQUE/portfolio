import { Component } from '@angular/core';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { SpotlightDirective } from '../../../shared/directives/spotlight.directive';

/** About: a bento grid of glass cards. Each card tilts and lights up under the pointer. */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, SpotlightDirective, SectionHeadingComponent],
  template: `
    <section class="section" id="about">
      <div class="container">
        <app-section-heading index="01" label="About" title="Engineer first. *Team lead* by choice." />

        <div class="bento">
          <article class="card bio" appSpotlight [tilt]="2" appReveal>
            <h3>Who I am</h3>
            <p>{{ profile.summary }}</p>
            <ul class="focus">
              @for (item of focus; track item) {
                <li class="chip">{{ item }}</li>
              }
            </ul>
          </article>

          <article class="card now" appSpotlight [tilt]="4" [appReveal]="0.06">
            <p class="mono label"><span class="live"></span>Currently</p>
            <h3>{{ current.role }}</h3>
            <p class="mute">{{ current.company }} · {{ current.location }}</p>
          </article>

          <article class="card where" appSpotlight [tilt]="4" [appReveal]="0.12">
            <p class="mono label">Based in</p>
            <h3>{{ place }}</h3>
            <p class="mute">Working with teams in Kochi</p>
            <svg class="globe" viewBox="0 0 120 120" fill="none" stroke="currentColor" aria-hidden="true">
              <circle cx="60" cy="60" r="56" />
              <ellipse cx="60" cy="60" rx="24" ry="56" />
              <ellipse cx="60" cy="60" rx="56" ry="20" />
              <path d="M4 60h112M60 4v112" />
            </svg>
          </article>

          <article class="card edu" appSpotlight [tilt]="3" [appReveal]="0.06">
            <p class="mono label">Education</p>
            <ul>
              @for (item of education; track item.degree) {
                <li>
                  <span class="deg">{{ item.degree }}</span>
                  <span class="mute">{{ item.institution }}</span>
                  @if (item.year) {
                    <span class="yr mono">{{ item.year }}</span>
                  }
                </li>
              }
            </ul>
          </article>

          <article class="card certs" appSpotlight [tilt]="4" [appReveal]="0.12">
            <p class="mono label">Certified in</p>
            <ul>
              @for (cert of certifications; track cert) {
                <li><span class="grad">{{ cert }}</span></li>
              }
            </ul>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .bento {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 1rem;
    }
    .card { padding: clamp(1.25rem, 2.4vw, 2rem); overflow: hidden; }
    .bio { grid-column: span 7; grid-row: span 2; }
    .now { grid-column: span 5; }
    .where { grid-column: span 5; }
    .edu { grid-column: span 7; }
    .certs { grid-column: span 5; }

    h3 { font-size: clamp(1.2rem, 1.8vw, 1.5rem); margin-bottom: 0.4rem; }
    .label { display: flex; align-items: center; gap: 0.5rem; color: var(--c1); margin-bottom: 0.9rem; }
    .live { width: 7px; height: 7px; border-radius: 50%; background: #3dffa8; box-shadow: 0 0 10px #3dffa8; }

    .bio h3 { font-size: clamp(1.4rem, 2.2vw, 1.8rem); margin-bottom: 1rem; }
    .bio p { font-size: clamp(1rem, 1.25vw, 1.12rem); line-height: 1.7; color: #c9cddc; }
    .focus { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem; }

    .where { min-height: 11rem; }
    .globe {
      position: absolute;
      right: -1.5rem;
      bottom: -2.5rem;
      width: 10.5rem;
      stroke-width: 0.8;
      color: var(--c2);
      opacity: 0.55;
      filter: drop-shadow(0 0 10px var(--c2));
      animation: turn 30s linear infinite;
    }
    @keyframes turn { to { transform: rotate(360deg); } }

    .edu ul { display: grid; gap: 1rem; }
    .edu li { display: grid; grid-template-columns: 1fr auto; gap: 0 1rem; line-height: 1.35; }
    .deg { font-weight: 500; }
    .edu .mute { grid-column: 1; font-size: 0.9rem; }
    .yr { grid-column: 2; grid-row: 1 / span 2; align-self: center; color: var(--c1); }

    .certs ul { display: flex; flex-wrap: wrap; gap: 0.4rem 1.25rem; }
    .certs li { font-size: clamp(1.4rem, 2.4vw, 2rem); font-weight: 600; letter-spacing: -0.03em; }

    @media (max-width: 860px) {
      .bento > * { grid-column: 1 / -1; }
    }
  `]
})
export class AboutComponent {
  profile = RESUME_DATA.profile;
  current = RESUME_DATA.experience[0];
  education = RESUME_DATA.education;
  certifications = RESUME_DATA.certifications;
  place = RESUME_DATA.profile.location.split(',').slice(0, 2).join(',');
  focus = ['Performance', 'Clean code', 'Mentoring', 'Agile delivery', 'Finance & ERP'];
}
