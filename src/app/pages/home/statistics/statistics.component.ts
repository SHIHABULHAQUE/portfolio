import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface StatItem {
  id: string;
  targetVal: number;
  currentDisplay: string;
  suffix: string;
  label: string;
  color: string;
  isDecimal: boolean;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section stats-section">
      <!-- Glow bubble -->
      <div class="stats-glow"></div>

      <div class="container">
        <div class="stats-grid">
          <div class="stat-card glass-panel" *ngFor="let stat of stats">
            <div class="stat-number-wrapper">
              <span class="stat-number" [id]="stat.id">{{ stat.currentDisplay }}</span>
              <span class="stat-suffix">{{ stat.suffix }}</span>
            </div>
            <div class="stat-label">{{ stat.label }}</div>
            <!-- Bottom colorful indicator line -->
            <div class="stat-line" [style.background]="stat.color"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-section {
      padding: 6rem 0;
      position: relative;
      background: rgba(10, 15, 26, 0.2);
    }

    .stats-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60vw;
      height: 250px;
      background: radial-gradient(circle, rgba(0, 240, 255, 0.04) 0%, rgba(189, 0, 255, 0.02) 60%, transparent 100%);
      filter: blur(80px);
      pointer-events: none;
      z-index: 1;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      position: relative;
      z-index: 2;

      @media (max-width: 992px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      @media (max-width: 576px) {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
    }

    .stat-card {
      padding: 2.5rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform 0.4s var(--ease-premium), border-color 0.4s;
      
      &:hover {
        transform: translateY(-8px);
        border-color: var(--primary);
        box-shadow: 0 20px 40px rgba(0, 240, 255, 0.05);
        
        .stat-number-wrapper {
          transform: scale(1.05);
        }
        
        .stat-line {
          width: 80%;
        }
      }
    }

    .stat-number-wrapper {
      display: flex;
      align-items: baseline;
      justify-content: center;
      margin-bottom: 0.75rem;
      transition: transform 0.4s var(--ease-premium);
    }

    .stat-number {
      font-family: var(--font-heading);
      font-size: clamp(2.5rem, 5vw, 3.8rem);
      font-weight: 800;
      color: #ffffff;
      line-height: 1;
      letter-spacing: -0.03em;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }

    .stat-suffix {
      font-family: var(--font-heading);
      font-size: clamp(1.5rem, 3vw, 2.2rem);
      font-weight: 700;
      color: var(--primary);
      margin-left: 2px;
      text-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
    }

    .stat-label {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--text-muted);
      max-width: 180px;
    }

    .stat-line {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 3px;
      border-radius: 3px 3px 0 0;
      transition: width 0.4s var(--ease-premium);
      box-shadow: 0 -2px 10px rgba(0, 240, 255, 0.2);
    }
  `]
})
export class StatisticsComponent implements AfterViewInit {
  stats: StatItem[] = [
    { id: 'stat-years', targetVal: 5.6, currentDisplay: '0', suffix: '+', label: 'Years Experience', color: 'var(--primary)', isDecimal: true },
    { id: 'stat-projects', targetVal: 12, currentDisplay: '0', suffix: '+', label: 'Projects Delivered', color: 'var(--accent)', isDecimal: false },
    { id: 'stat-banking', targetVal: 6, currentDisplay: '0', suffix: '+', label: 'Banking Solutions Built', color: 'var(--secondary)', isDecimal: false },
    { id: 'stat-tech', targetVal: 15, currentDisplay: '0', suffix: '+', label: 'Technologies Mastered', color: 'var(--accent-orange)', isDecimal: false }
  ];

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  private initAnimations(): void {
    const cards = this.el.nativeElement.querySelectorAll('.stat-card');
    
    // Fade in the cards staggered
    gsap.from(cards, {
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 85%'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Animate the counters
    this.stats.forEach(stat => {
      const element = document.getElementById(stat.id);
      if (!element) return;

      const obj = { value: 0 };
      gsap.to(obj, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        value: stat.targetVal,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          if (stat.isDecimal) {
            stat.currentDisplay = obj.value.toFixed(1);
          } else {
            stat.currentDisplay = Math.floor(obj.value).toString();
          }
          element.innerText = stat.currentDisplay;
        }
      });
    });
  }
}
