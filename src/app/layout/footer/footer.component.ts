import { Component } from '@angular/core';
import { RESUME_DATA } from '../../core/data/resume.data';
import { scrollToId } from '../../shared/utils/scroll';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container row">
        <p><span class="logo">MSH</span> <span class="mute">© {{ year }} {{ profile.name }}</span></p>
        <nav aria-label="Footer">
          <a [href]="profile.social.linkedin" target="_blank" rel="noopener">LinkedIn</a>
          <a [href]="profile.social.github" target="_blank" rel="noopener">GitHub</a>
          <a href="assets/resume.pdf" download="Mohammed-Shihabul-Haque-Resume.pdf">Résumé</a>
          <a href="#top" (click)="top($event)">Back to top ↑</a>
        </nav>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: relative;
      padding-block: 1.75rem 2rem;
      border-top: 1px solid var(--line);
      background: rgba(5, 6, 11, 0.7);
      font-size: 0.9rem;
    }
    /* A thin line of light along the top edge */
    .footer::before {
      content: '';
      position: absolute;
      inset: -1px 20% auto;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--c1), var(--c2), var(--c3), transparent);
    }
    .row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem 2rem; }
    .logo {
      margin-right: 0.6rem;
      font-weight: 700;
      background: var(--grad);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    nav { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; padding-right: 4rem; }
    nav a { color: var(--mute); transition: color 0.2s linear; }
    nav a:hover { color: var(--text); }
  `]
})
export class FooterComponent {
  profile = RESUME_DATA.profile;
  year = new Date().getFullYear();

  top(event: Event): void {
    event.preventDefault();
    scrollToId('top');
  }
}
