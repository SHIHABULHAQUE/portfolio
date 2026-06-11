import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RESUME_DATA } from '../../../core/data/resume.data';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  isSubmitted = false;
  isLoading = false;

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.formData.name || !this.formData.email || !this.formData.message) return;

    this.isLoading = true;

    // Simulate encrypted API transfer
    setTimeout(() => {
      this.isLoading = false;
      this.isSubmitted = true;
    }, 1500);
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
    this.isSubmitted = false;
  }
}
