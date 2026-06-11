import { Component, OnInit, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RESUME_DATA } from '../../../core/data/resume.data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, AfterViewInit {
  experience = RESUME_DATA.experience;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
    }
  }

  private initScrollAnimations(): void {
    // 1. Animate active timeline progress fill-line on scroll scrub
    gsap.to('.timeline-progress-bar', {
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top 35%',
        end: 'bottom 65%',
        scrub: true
      },
      scaleY: 1,
      ease: 'none'
    });

    // 2. Reveal card items staggered
    const items = this.el.nativeElement.querySelectorAll('.timeline-item');
    items.forEach((item: HTMLElement) => {
      const card = item.querySelector('.timeline-card');
      const node = item.querySelector('.timeline-node');

      if (card && node) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%'
          },
          opacity: 0,
          x: 40,
          duration: 0.8,
          ease: 'power3.out'
        });

        gsap.from(node, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%'
          },
          scale: 0,
          opacity: 0,
          duration: 0.5,
          delay: 0.15,
          ease: 'back.out(2)'
        });
      }
    });
  }
}
