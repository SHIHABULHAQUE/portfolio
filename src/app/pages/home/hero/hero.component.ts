import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  data = RESUME_DATA.profile;

  // Typewriter target values
  typewriterText1 = 'BUILDING ENTERPRISE SOFTWARE';
  typewriterText2 = 'THAT POWERS MILLIONS OF USERS';

  // Signals-driven UI states
  display1 = signal('');
  display2 = signal('');

  isCursor1Blinking = signal(false);
  isCursor2Blinking = signal(false);

  private typewriterIntervals: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Stagger initial page entry
      this.initGSAPAnimations();

      // 2. Start typewriter loops
      this.startTypewriterFlow();
    }
  }

  ngOnDestroy(): void {
    this.typewriterIntervals.forEach(interval => clearInterval(interval));
  }

  private initGSAPAnimations(): void {
    gsap.from('.hero-badge', {
      opacity: 0,
      y: -25,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.hero-title', {
      opacity: 0,
      y: 40,
      duration: 1.2,
      delay: 0.15,
      ease: 'power3.out'
    });

    gsap.from('.hero-tech-list', {
      opacity: 0,
      y: 20,
      duration: 1.0,
      delay: 1.1,
      ease: 'power3.out'
    });

    gsap.from('.cta-wrapper', {
      opacity: 0,
      y: 15,
      duration: 0.8,
      delay: 1.3,
      ease: 'power3.out'
    });

    gsap.from('.glass-terminal', {
      opacity: 0,
      x: 50,
      rotateY: -25,
      duration: 1.4,
      delay: 0.4,
      ease: 'power3.out'
    });
  }

  private async startTypewriterFlow() {
    this.isCursor1Blinking.set(false);
    this.isCursor2Blinking.set(false);

    await this.delay(500);

    // Type first phrase
    await this.typeEffect(this.typewriterText1, this.display1, 40);
    this.isCursor1Blinking.set(true);
    
    await this.delay(400);
    this.isCursor1Blinking.set(false);

    // Type second phrase
    await this.typeEffect(this.typewriterText2, this.display2, 30);
    this.isCursor2Blinking.set(true);
  }

  private typeEffect(text: string, writeSignal: WritableSignal<string>, speed: number): Promise<void> {
    return new Promise(resolve => {
      let index = 0;
      const interval = setInterval(() => {
        writeSignal.set(text.substring(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
      this.typewriterIntervals.push(interval);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  scrollToSection(event: Event, targetId: string): void {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
}
