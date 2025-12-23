import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  tech: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      title: 'Enterprise ERP Platform',
      description:
        'Large-scale Angular application supporting complex financial workflows, role-based access, and performance-critical UI.',
      tech: ['Angular', 'TypeScript', '.NET Core', 'SQL']
    },
    {
      title: 'AI-enabled Document Automation',
      description:
        'Integrated LLM-powered document generation and summarization into enterprise systems to improve productivity.',
      tech: ['Angular', 'LLMs', 'REST APIs']
    },
    {
      title: 'Financial Analytics Dashboard',
      description:
        'Built interactive dashboards with reusable components, optimized change detection, and large data handling.',
      tech: ['Angular', 'RxJS', 'Charts', 'SQL']
    }
  ];
}
