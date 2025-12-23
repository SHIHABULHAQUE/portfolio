import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './layout/header/header.component';
import { HeroComponent } from './pages/home/hero/hero.component';
import { ThemeService } from './core/theme.service';
import { ExperienceComponent } from './pages/home/experience/experience.component';
import { SkillsComponent } from './pages/home/skills/skills.component';
import { AiExperienceComponent } from './pages/home/ai-experience/ai-experience.component';
import { ProjectsComponent } from './pages/home/projects/projects.component';
import { EducationComponent } from './pages/home/education/education.component';
import { ContactComponent } from './pages/home/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    HeroComponent,
    ExperienceComponent,
SkillsComponent,
AiExperienceComponent,
ProjectsComponent,
EducationComponent,
ContactComponent
  ],
  template: `
<app-header />

<app-hero/>
<app-experience />
<app-skills />
<app-ai-experience />
<app-projects />
<app-education />
<app-contact />
  `
})
export class AppComponent implements OnInit {
  constructor(private theme: ThemeService) {}

  ngOnInit() {
    // this.theme.initTheme();
  }
}
