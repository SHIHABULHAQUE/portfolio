import { Component } from '@angular/core';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { scrollToId } from '../../../shared/utils/scroll';
import { CountUpDirective } from '../../../shared/directives/count-up.directive';
import { MagneticDirective } from '../../../shared/directives/magnetic.directive';

/** Opening screen. The text sits on the left; the particle sphere (SceneComponent) glows on the right. */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CountUpDirective, MagneticDirective],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  data = RESUME_DATA.profile;

  private parts = RESUME_DATA.profile.name.split(' ');
  first = this.parts[0];
  rest = this.parts.slice(1).join(' ');

  /** Rotating line beside the role. The first word is repeated last so the loop is seamless. */
  words = ['Angular', '.NET', 'TypeScript', 'SQL Server', 'Angular'];

  facts = [
    { to: RESUME_DATA.profile.years, prefix: '', suffix: '+', label: 'Years of experience' },
    { to: RESUME_DATA.experience.length, prefix: '', suffix: '', label: 'Companies' },
    { to: RESUME_DATA.projects.length, prefix: '', suffix: '', label: 'Enterprise projects' },
    { to: 21, prefix: 'v2–', suffix: '', label: 'Angular versions' }
  ];

  go(event: Event, id: string): void {
    event.preventDefault();
    scrollToId(id);
  }
}
