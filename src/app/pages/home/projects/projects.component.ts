import { Component, signal } from '@angular/core';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects = RESUME_DATA.projects;
  expandedIndex = signal<number | null>(0);

  toggle(index: number): void {
    this.expandedIndex.update(current => (current === index ? null : index));
  }
}
