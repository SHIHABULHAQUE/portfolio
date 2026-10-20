import { Component } from '@angular/core';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {
  education = RESUME_DATA.education;
  certifications = RESUME_DATA.certifications;
}
