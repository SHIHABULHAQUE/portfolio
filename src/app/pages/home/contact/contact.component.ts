import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, SectionHeadingComponent, RevealDirective],
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

  /** Opens the visitor's mail client with the letter pre-filled. */
  onSubmit(event: Event): void {
    event.preventDefault();
    const { name, email, message } = this.formData;
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Hello from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${this.profile.email}?subject=${subject}&body=${body}`;
    this.isSubmitted.set(true);
  }
}
