import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Education {
  degree: string;
  institute: string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {
  education: Education[] = [
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institute: 'MES KVM College'
    },
    {
      degree: 'Higher Secondary – Computer Science',
      institute: 'GHSS'
    },
    {
      degree: 'High School',
      institute: 'Majilis HSS Vengad'
    }
  ];

  certifications: string[] = ['Angular', 'React.js', '.NET'];
}
