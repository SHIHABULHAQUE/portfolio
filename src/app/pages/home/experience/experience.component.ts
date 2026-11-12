import { Component } from '@angular/core';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { SpotlightDirective } from '../../../shared/directives/spotlight.directive';

/** Experience as a glowing timeline: the rail lights up as you scroll down it. */
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective, SpotlightDirective, SectionHeadingComponent],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  jobs = RESUME_DATA.experience.map(job => {
    const [from, to] = job.period.split(' - ');
    return { ...job, from, to: to === 'Current' ? 'Present' : to, current: to === 'Current' };
  });
}
