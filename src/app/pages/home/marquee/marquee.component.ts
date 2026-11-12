import { Component } from '@angular/core';

/** A slim, endless band of the core stack between the hero and the first section. CSS only. */
@Component({
  selector: 'app-marquee',
  standalone: true,
  template: `
    <div class="band" role="region" aria-label="Core technologies">
      <p class="sr-only">{{ items.join(', ') }}</p>
      <div class="track" aria-hidden="true">
        @for (copy of [0, 1]; track copy) {
          <ul>
            @for (item of items; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        }
      </div>
    </div>
  `,
  styles: [`
    .band {
      position: relative;
      overflow: hidden;
      padding-block: 1.15rem;
      border-block: 1px solid var(--line);
      background: rgba(8, 10, 18, 0.55);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
      mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
    }
    .track { display: flex; width: max-content; animation: drift 38s linear infinite; }
    .band:hover .track { animation-play-state: paused; }
    ul { display: flex; flex: none; }
    li {
      display: flex;
      align-items: center;
      flex: none;
      font: 500 0.85rem var(--mono);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--mute);
      white-space: nowrap;
    }
    li::after {
      content: '';
      width: 6px;
      height: 6px;
      margin-inline: 2rem;
      border-radius: 50%;
      background: var(--grad);
      box-shadow: 0 0 10px var(--c2);
    }
    @keyframes drift { to { transform: translateX(-50%); } }
  `]
})
export class MarqueeComponent {
  items = ['Angular', 'TypeScript', '.NET', 'SQL Server', 'RxJS', 'NgRx', 'REST APIs', 'Azure DevOps', 'CI/CD', 'Agile', 'Team leadership', 'System design'];
}
