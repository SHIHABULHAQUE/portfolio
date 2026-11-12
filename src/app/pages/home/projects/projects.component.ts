import { Component, signal } from '@angular/core';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { SpotlightDirective } from '../../../shared/directives/spotlight.directive';

/** Projects: a grid of 3D-tilting glass cards. Each opens in place to show the case study. */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RevealDirective, SpotlightDirective, SectionHeadingComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects = RESUME_DATA.projects;

  /** Index of the card whose case study is open; -1 when none. */
  open = signal(-1);

  toggle(index: number): void {
    this.open.update(current => (current === index ? -1 : index));
  }
}
