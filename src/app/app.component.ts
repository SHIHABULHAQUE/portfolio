import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { GameComponent } from './features/game/game.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ScrollProgressComponent } from './layout/scroll-progress/scroll-progress.component';
import { CursorComponent } from './layout/cursor/cursor.component';
import { SceneComponent } from './layout/scene/scene.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, GameComponent, ScrollProgressComponent, CursorComponent, SceneComponent],
  template: `
    <app-scene />
    <app-cursor />
    <app-scroll-progress />
    <app-header />
    <main id="top">
      <router-outlet />
    </main>
    <app-footer />
    <!-- The arcade is a toy: it loads once the page is idle, never before -->
    @defer (on idle) {
      <app-game />
    }
  `,
  styles: [`
    main, app-footer { position: relative; z-index: 1; display: block; }
  `]
})
export class AppComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Mohammed Shihabul Haque | Senior Software Engineer');
    this.meta.addTags([
      { name: 'description', content: 'Senior Software Engineer & Team Lead with 6+ years of experience in Angular, .NET, TypeScript and SQL.' },
      { name: 'keywords', content: 'Mohammed Shihabul Haque, Shihab, Shihabul Haque, Angular Developer, .NET Developer, Team Lead, Software Engineer, Pattambi, Kerala, Web Developer, Full Stack Developer' },
      { name: 'author', content: 'Mohammed Shihabul Haque' },

      // Open Graph / Facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://shihabulhaque.in/' },
      { property: 'og:title', content: 'Mohammed Shihabul Haque | Senior Software Engineer' },
      { property: 'og:description', content: 'Portfolio of Mohammed Shihabul Haque - Senior Software Engineer & Team Lead specializing in Angular, .NET, and Modern Web Architecture.' },

      // Twitter
      { property: 'twitter:card', content: 'summary' },
      { property: 'twitter:url', content: 'https://shihabulhaque.in/' },
      { property: 'twitter:title', content: 'Mohammed Shihabul Haque | Senior Software Engineer' },
      { property: 'twitter:description', content: 'Senior Software Engineer & Team Lead. Angular, .NET, TypeScript and SQL.' },
    ]);
  }
}
