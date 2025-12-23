import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
selector: 'app-contact',
standalone: true,
imports: [CommonModule],
templateUrl: './contact.component.html',
styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
email = 'shihabvmh51@gmail.com';
phone = '+91 98951 13071';
location = 'Pattambi, India';


links = [
{ label: 'GitHub', url: 'https://github.com/' }, // TODO: update
{ label: 'LinkedIn', url: 'https://linkedin.com/in/' } // TODO: update
];
}
