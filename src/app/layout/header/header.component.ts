import { Component } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private theme: ThemeService) {}

  toggleTheme() {
    this.theme.toggleTheme();
  }

  get isDarkMode() {
    return this.theme.isDark();
  }
}

