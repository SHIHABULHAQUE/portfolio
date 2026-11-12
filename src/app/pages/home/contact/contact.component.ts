import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { SpotlightDirective } from '../../../shared/directives/spotlight.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RevealDirective, SpotlightDirective, SectionHeadingComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  profile = RESUME_DATA.profile;

  formData = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitted = signal(false);
  copied = signal(false);

  /** Opens the visitor's mail client with the message pre-filled. */
  onSubmit(event: Event): void {
    event.preventDefault();
    const { name, email, message } = this.formData;
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Hello from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${this.profile.email}?subject=${subject}&body=${body}`;
    this.isSubmitted.set(true);
  }

  copyEmail(): void {
    navigator.clipboard?.writeText(this.profile.email).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
