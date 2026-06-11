import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RESUME_DATA } from '../../../core/data/resume.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  // Projects data held reactively inside signal wrapper
  projects = signal(RESUME_DATA.projects);
  
  // Expanded card tracking state driven by signal
  expandedIndex = signal<number | null>(null);

  toggleExpand(index: number): void {
    this.expandedIndex.set(this.expandedIndex() === index ? null : index);
  }

  getSimulatedUrl(index: number): string {
    const urls = [
      'localhost:4200/erp-suite/finance-trading',
      'gateway.shihab.in/api/v2/verification',
      'internal.bank.net/cis/customer-search',
      'backoffice.mutualfunds.com/audit-reports',
      'riskengine.bank.net/loan-against-shares',
      'irohub.edu.in/courses/advanced-angular-ssr'
    ];
    return urls[index] || 'localhost:3000';
  }
}
