import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


interface Experience {
role: string;
company: string;
location?: string;
period: string;
description: string[];
}


@Component({
selector: 'app-experience',
standalone: true,
imports: [CommonModule],
templateUrl: './experience.component.html',
styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
experiences: Experience[] = [
{
role: 'Senior Software Engineer / Team Lead',
company: 'Your Company Name', // TODO
location: 'India / Remote', // TODO
period: 'YYYY – Present', // TODO
description: [
'Led development of enterprise-scale Angular applications',
'Designed reusable component architecture and coding standards',
'Worked closely with product and backend teams to deliver features',
'Improved application performance and maintainability'
]
},
{
role: 'Senior Software Engineer',
company: 'Previous Company', // TODO
location: 'India', // TODO
period: 'YYYY – YYYY', // TODO
description: [
'Developed complex UI modules using Angular',
'Converted business requirements into scalable front-end solutions',
'Performed code reviews and mentored junior developers'
]
}
];
}
