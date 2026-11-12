import { Component, Input } from '@angular/core';

/** "MSH" mark: serif initials in a gold-ruled navy square. Scales with its font-size. */
@Component({
  selector: 'app-monogram',
  standalone: true,
  template: `<span class="mark" [class.light]="light" aria-hidden="true">MSH</span>`,
  styles: [`
    :host {
      display: inline-block;
      font-size: 1rem;
    }
    .mark {
      display: grid;
      place-items: center;
      width: 2.6em;
      height: 2.6em;
      border-radius: 0.3em;
      background: var(--navy);
      color: var(--white);
      box-shadow: inset 0 0 0 0.12em var(--navy), inset 0 0 0 0.17em var(--gold);
      font-family: var(--serif);
      font-weight: 600;
      font-size: 1em;
      letter-spacing: -0.02em;
      line-height: 1;
    }
    .light {
      background: var(--white);
      color: var(--navy);
      box-shadow: inset 0 0 0 0.12em var(--white), inset 0 0 0 0.17em var(--gold);
    }
  `]
})
export class MonogramComponent {
  @Input() light = false;
}
