import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


interface SkillGroup {
title: string;
skills: { name: string; level: 'Expert' | 'Advanced' | 'Intermediate' }[];
}


@Component({
selector: 'app-skills',
standalone: true,
imports: [CommonModule],
templateUrl: './skills.component.html',
styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
groups: SkillGroup[] = [
{
title: 'Frontend & Angular',
skills: [
{ name: 'Angular (7–17)', level: 'Expert' },
{ name: 'TypeScript', level: 'Expert' },
{ name: 'RxJS', level: 'Advanced' },
{ name: 'HTML5 / CSS / SCSS', level: 'Expert' }
]
},
{
title: 'Architecture & Quality',
skills: [
{ name: 'Component Architecture', level: 'Expert' },
{ name: 'Performance Optimization', level: 'Advanced' },
{ name: 'Accessibility (a11y)', level: 'Advanced' },
{ name: 'Unit Testing (Jest/Karma)', level: 'Advanced' }
]
},
{
title: 'AI & Backend',
skills: [
{ name: 'LLM Integration', level: 'Advanced' },
{ name: '.NET Core APIs', level: 'Intermediate' },
{ name: 'SQL', level: 'Intermediate' }
]
},
{
title: 'Tools & Process',
skills: [
{ name: 'Git / GitLab / Azure DevOps', level: 'Expert' },
{ name: 'CI/CD Pipelines', level: 'Advanced' },
{ name: 'Agile / Scrum', level: 'Expert' }
]
}
];
}
