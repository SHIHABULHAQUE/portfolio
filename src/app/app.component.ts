import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { GameComponent } from './features/game/game.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, GameComponent],
  template: `
    <app-header></app-header>
    <main>
      <div class="bg-pixel-pattern"></div>
      <router-outlet></router-outlet>
    </main>
    <footer style="text-align: center; padding: 2rem; color: var(--text-dim); font-size: 0.85rem;">
      <p>&copy; 2026 Mohammed Shihabul Haque. All rights reserved.</p>
    </footer>
    <app-game></app-game>
  `,
  styles: []
})
export class AppComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Mohammed Shihabul Haque | Senior Software Engineer');
    this.meta.addTags([
      { name: 'description', content: 'Senior Software Engineer & Team Lead with 5.6+ years of experience in Angular, .NET, and SQL. Expert in architecting scalable web solutions.' },
      { name: 'keywords', content: 'Mohammed Shihabul Haque, Shihab, Shihabul Haque, Angular Developer, .NET Developer, Team Lead, Software Engineer, Pattambi, Kerala, Web Developer, Full Stack Developer' },
      { name: 'author', content: 'Mohammed Shihabul Haque' },

      // Open Graph / Facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://shihabulhaque.in/' },
      { property: 'og:title', content: 'Mohammed Shihabul Haque | Senior Software Engineer' },
      { property: 'og:description', content: 'Portfolio of Mohammed Shihabul Haque - Senior Software Engineer & Team Lead specializing in Angular, .NET, and Modern Web Architecture.' },
      { property: 'og:image', content: 'https://shihabulhaque.in/assets/images/preview-card.jpg' },

      // Twitter
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: 'https://shihabulhaque.in/' },
      { property: 'twitter:title', content: 'Mohammed Shihabul Haque | Senior Software Engineer' },
      { property: 'twitter:description', content: 'Senior Software Engineer & Team Lead. Expert in Angular, .NET, and building scalable applications.' },
      { property: 'twitter:image', content: 'https://shihabulhaque.in/assets/images/preview-card.jpg' }
    ]);
  }
}
