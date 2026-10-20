import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { GameComponent } from './features/game/game.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, GameComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <footer class="site-footer">
      <span class="sig">Shihab</span>
      <p>&copy; 2026 Mohammed Shihabul Haque · Crafted with care in Kerala</p>
    </footer>
    <app-game />
  `,
  styles: [`
    .site-footer {
      background: var(--ink);
      color: rgba(244, 239, 230, 0.55);
      text-align: center;
      padding: 0 1.25rem 3rem;
      font-size: 0.8rem;
      letter-spacing: 0.04em;
    }
    .sig {
      display: block;
      font-family: var(--font-script);
      font-size: 3.4rem;
      line-height: 1.3;
      color: var(--sand);
      padding-top: 1rem;
      border-top: 1px solid rgba(244, 239, 230, 0.1);
      max-width: 1120px;
      margin: 0 auto;
    }
  `]
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
      { property: 'og:image', content: 'https://shihabulhaque.in/assets/images/shihab.jpg' },

      // Twitter
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: 'https://shihabulhaque.in/' },
      { property: 'twitter:title', content: 'Mohammed Shihabul Haque | Senior Software Engineer' },
      { property: 'twitter:description', content: 'Senior Software Engineer & Team Lead. Expert in Angular, .NET, and building scalable applications.' },
      { property: 'twitter:image', content: 'https://shihabulhaque.in/assets/images/shihab.jpg' }
    ]);
  }
}
