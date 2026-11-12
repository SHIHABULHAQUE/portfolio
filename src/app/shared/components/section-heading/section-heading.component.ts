import { Component, Input } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

/** Section opener: numbered mono label, a title whose *starred* words take the gradient, optional intro. */
@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <header class="sh" appReveal>
      <p class="mono tag"><span class="line"></span>{{ index }} / {{ label }}</p>
      <h2>
        @for (part of parts; track $index) {
          <span [class.grad]="part.em">{{ part.text }}</span>
        }
      </h2>
      @if (intro) {
        <p class="intro mute">{{ intro }}</p>
      }
    </header>
  `,
  styles: [`
    :host { display: block; }
    .sh { max-width: 46rem; margin-bottom: clamp(2.25rem, 5vw, 3.5rem); }
    .tag { display: flex; align-items: center; gap: 0.75rem; color: var(--c1); margin-bottom: 1rem; }
    .line { width: 2.25rem; height: 1px; background: var(--grad); }
    h2 { font-size: clamp(2rem, 4.6vw, 3.4rem); }
    .intro { margin-top: 1rem; font-size: 1.08rem; max-width: 38rem; }
  `]
})
export class SectionHeadingComponent {
  @Input({ required: true }) index = '';
  @Input({ required: true }) label = '';
  @Input() intro = '';

  parts: Array<{ text: string; em: boolean }> = [];

  @Input({ required: true }) set title(value: string) {
    // "Plain *highlighted* plain" -> alternating plain / gradient runs
    this.parts = value.split('*').map((text, i) => ({ text, em: i % 2 === 1 })).filter(part => part.text);
  }
}
