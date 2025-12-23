import {
  AfterViewInit,
  Component,
  Renderer2
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,          // ✅ REQUIRED
  imports: [CommonModule],   // ✅ REQUIRED
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.initMagneticButtons();
    this.initImageTilt();
    this.initRevealAnimation();
  }

  private initMagneticButtons(): void {
    const buttons = document.querySelectorAll('.magnetic');

    buttons.forEach((btn: any) => {
      this.renderer.listen(btn, 'mousemove', (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        this.renderer.setStyle(
          btn,
          'transform',
          `translate(${x * 0.18}px, ${y * 0.18}px)`
        );
      });

      this.renderer.listen(btn, 'mouseleave', () => {
        this.renderer.setStyle(btn, 'transform', 'translate(0,0)');
      });
    });
  }

  private initImageTilt(): void {
    const image = document.querySelector('.image img') as HTMLElement;
    if (!image) return;

    this.renderer.listen(image, 'mousemove', (e: MouseEvent) => {
      const rect = image.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -14;
      const rotateY = ((x / rect.width) - 0.5) * 14;

      this.renderer.setStyle(
        image,
        'transform',
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
      );
    });

    this.renderer.listen(image, 'mouseleave', () => {
      this.renderer.setStyle(
        image,
        'transform',
        'rotateX(0deg) rotateY(0deg) scale(1)'
      );
    });
  }

  private initRevealAnimation(): void {
    document
      .querySelectorAll('.reveal')
      .forEach(el => this.renderer.addClass(el, 'revealed'));
  }
}
