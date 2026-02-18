import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { ExperienceComponent } from './experience/experience.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { EducationComponent } from './education/education.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HeroComponent,
        ExperienceComponent,
        SkillsComponent,
        ProjectsComponent,
        ContactComponent,
        EducationComponent
    ],
    template: `
    <app-hero id="hero"></app-hero>
    <div class="container">
        <app-experience id="experience"></app-experience>
        <app-skills id="skills"></app-skills>
        <app-education id="education"></app-education>
        <app-projects id="projects"></app-projects>
        <app-contact id="contact"></app-contact>
    </div>
  `
})
export class HomeComponent { }
