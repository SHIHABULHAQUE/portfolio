import { Component, Input } from '@angular/core';
import { CalligraphyComponent } from '../calligraphy/calligraphy.component';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [CalligraphyComponent, RevealDirective],
  template: `
    <div class="heading" [class.light]="light" appReveal>
      <div class="meta">
        <span class="index">{{ index }}</span>
        <span class="rule"></span>
        <span class="eyebrow">{{ eyebrow }}</span>
      </div>
      <h2>
        {{ title }}
        <app-calligraphy class="script-word" [text]="script" trigger="view" [delay]="0.3" />
      </h2>
    </div>
  `,
  styles: [`
    .heading {
      margin-bottom: 4.5rem;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      margin-bottom: 1.4rem;
    }
    .index {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 1.1rem;
      color: var(--ink-soft);
    }
    .rule {
      width: 48px;
      height: 1px;
      background: var(--line-strong);
    }
    h2 {
      font-size: clamp(2.6rem, 6vw, 4.6rem);
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      column-gap: 0.4em;
    }
    .script-word {
      height: 1.25em;
      color: var(--moss);
      transform: translateY(0.28em) rotate(-4deg);
      transform-origin: left center;
    }
    .light h2,
    .light .index {
      color: var(--paper);
    }
    .light .rule {
      background: rgba(244, 239, 230, 0.35);
    }
    .light .eyebrow {
      color: var(--sand);
    }
    .light .script-word {
      color: var(--moss-soft);
    }
  `]
})
export class SectionHeadingComponent {
  @Input() index = '';
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() script = '';
  @Input() light = false;
}
