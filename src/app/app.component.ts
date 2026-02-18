import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main>
      <div class="bg-pixel-pattern"></div>
      <router-outlet></router-outlet>
    </main>
    <footer style="text-align: center; padding: 2rem; color: var(--text-dim); font-size: 0.85rem;">
      <p>&copy; 2026 Mohammed Shihabul Haque. All rights reserved.</p>
    </footer>
  `,
  styles: []
})
export class AppComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Mohammed Shihabul Haque | Senior Software Engineer');
    this.meta.addTags([
      { name: 'description', content: 'Portfolio of Mohammed Shihabul Haque, a Senior Software Engineer & Team Lead specializing in Angular and modern web technologies.' },
      { name: 'keywords', content: 'Angular, Typescript, Software Engineer, Portfolio, Web Developer, Team Lead' },
      { name: 'author', content: 'Mohammed Shihabul Haque' }
    ]);
  }
}
