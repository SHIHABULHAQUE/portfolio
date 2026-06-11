import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, ViewChild, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface VectorParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

@Component({
  selector: 'app-gravity-particles',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas class="particles-canvas"></canvas>`,
  styles: [`
    .particles-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -2;
      pointer-events: none;
      background: #030303; /* Pure obsidian base */
    }
  `]
})
export class GravityParticlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private animFrameId!: number;
  private particles: VectorParticle[] = [];
  
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.initCanvas();
        this.generateParticles();
        this.loop();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Scale canvas to match high-DPR screens
    this.resizeCanvas();

    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onResize = (): void => {
    this.resizeCanvas();
  };

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private onMouseMove = (e: MouseEvent): void => {
    this.mouse.targetX = e.clientX;
    this.mouse.targetY = e.clientY;
  };

  private generateParticles(): void {
    const count = 120;
    const colors = [
      'rgba(0, 240, 255, ',  // primary cyan
      'rgba(189, 0, 255, ',  // accent purple
      'rgba(100, 255, 218, ' // secondary mint
    ];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.15 + 0.05), // upward drift vector
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.45 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  private loop = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Interpolate mouse movements
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    this.particles.forEach(p => {
      // 1. Particle upwards drift calculation
      p.y += p.vy;
      p.x += p.vx;

      // 2. Subtle gravity-defying mouse push
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        p.x += (dx / dist) * force * 0.4;
        p.y += (dy / dist) * force * 0.4;
      }

      // 3. Screen bounds wrap around
      if (p.y < 0) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      // 4. Render circles
      this.ctx.fillStyle = `${p.color}${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Request next frame outside Angular zone
    this.animFrameId = requestAnimationFrame(this.loop);
  };
}
