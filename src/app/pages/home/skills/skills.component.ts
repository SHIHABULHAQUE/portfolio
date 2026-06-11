import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Tag3D {
  text: string;
  x: number;
  y: number;
  z: number;
  color: string;
  w?: number; // projected width for hover testing
  h?: number; // projected height
  px?: number; // projected center x
  py?: number; // projected center y
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section skills-section" id="skills">
      <!-- Glow background -->
      <div class="skills-glow-bg"></div>

      <div class="container skills-container">
        <div class="section-header centered">
          <span class="section-subtitle bracket-text">EXPERTISE</span>
          <h2 class="section-title">Skills & Technologies</h2>
        </div>

        <div class="skills-wrapper">
          <!-- Left Info Card -->
          <div class="skills-info-card glass-panel">
            <h3 class="info-title">Core Competencies</h3>
            <p class="info-desc">
              Specialized in architecting scalable client-side architectures, robust API layers, and highly reliable financial solutions.
            </p>
            <div class="skill-category">
              <div class="category">
                <span class="cat-dot primary"></span>
                <span class="cat-label">Frontend Architecture</span>
              </div>
              <div class="category">
                <span class="cat-dot accent"></span>
                <span class="cat-label">Backend & Database</span>
              </div>
              <div class="category">
                <span class="cat-dot secondary"></span>
                <span class="cat-label">Cloud & DevOps</span>
              </div>
            </div>
          </div>

          <!-- 3D Rotating Tag Sphere Canvas -->
          <div class="sphere-canvas-container" #container>
            <canvas #sphereCanvas></canvas>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .skills-section {
      position: relative;
      overflow: hidden;
    }

    .skills-glow-bg {
      position: absolute;
      top: 50%;
      right: -10%;
      width: 40vw;
      height: 40vw;
      background: radial-gradient(circle, rgba(189, 0, 255, 0.035) 0%, transparent 70%);
      filter: blur(100px);
      pointer-events: none;
      z-index: 1;
    }

    .skills-container {
      position: relative;
      z-index: 2;
    }

    .skills-wrapper {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      align-items: center;
      gap: 4rem;
      
      @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }

    .skills-info-card {
      padding: 3rem;
      
      .info-title {
        font-size: 1.8rem;
        font-weight: 800;
        margin-bottom: 1rem;
        letter-spacing: -0.01em;
      }

      .info-desc {
        color: var(--text-muted);
        line-height: 1.7;
        margin-bottom: 2rem;
        font-size: 1.05rem;
      }
    }

    .skill-category {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .category {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text-main);
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.04);
      
      .cat-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      
      .cat-dot.primary { background: var(--primary); box-shadow: 0 0 8px var(--primary); }
      .cat-dot.accent { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
      .cat-dot.secondary { background: var(--secondary); box-shadow: 0 0 8px var(--secondary); }
    }

    .sphere-canvas-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      aspect-ratio: 1;
      max-width: 500px;
      margin: 0 auto;
      cursor: grab;
      
      &:active {
        cursor: grabbing;
      }
      
      canvas {
        width: 100%;
        height: 100%;
      }
    }
  `]
})
export class SkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sphereCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  
  private rawSkills = [
    { text: 'Angular', type: 'frontend' },
    { text: 'TypeScript', type: 'frontend' },
    { text: '.NET', type: 'backend' },
    { text: 'C#', type: 'backend' },
    { text: 'SQL Server', type: 'backend' },
    { text: 'Azure', type: 'cloud' },
    { text: 'Git', type: 'cloud' },
    { text: 'REST API', type: 'backend' },
    { text: 'Banking Systems', type: 'backend' },
    { text: 'RxJS', type: 'frontend' },
    { text: 'NgRx', type: 'frontend' },
    { text: 'CI/CD Pipeline', type: 'cloud' },
    { text: 'Agile/Scrum', type: 'cloud' },
    { text: 'PrimeNG', type: 'frontend' },
    { text: 'Tailwind CSS', type: 'frontend' },
    { text: 'Jasper Reports', type: 'backend' },
    { text: 'Team Leadership', type: 'cloud' },
    { text: 'Performance Opt', type: 'frontend' }
  ];

  private tags: Tag3D[] = [];
  
  private radius = 180;
  private focalLength = 320;
  private autoSpeedX = 0.003;
  private autoSpeedY = 0.003;
  private currentSpeedX = 0.003;
  private currentSpeedY = 0.003;
  
  private isMouseInside = false;
  private mouseX = 0;
  private mouseY = 0;
  
  // Tag hover state tracked via Signal
  hoveredTagIndex = signal<number | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSphere();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initSphere(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    const size = Math.min(this.containerRef.nativeElement.clientWidth, 500);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    this.ctx.scale(dpr, dpr);
    
    const count = this.rawSkills.length;
    for (let i = 0; i < count; i++) {
      const theta = Math.acos(-1 + (2 * i) / count);
      const phi = Math.sqrt(count * Math.PI) * theta;
      
      const skill = this.rawSkills[i];
      let color = 'rgba(0, 240, 255, 1)';
      if (skill.type === 'backend') color = 'rgba(189, 0, 255, 1)';
      if (skill.type === 'cloud') color = 'rgba(100, 255, 218, 1)';

      this.tags.push({
        text: skill.text,
        x: this.radius * Math.sin(theta) * Math.cos(phi),
        y: this.radius * Math.sin(theta) * Math.sin(phi),
        z: this.radius * Math.cos(theta),
        color
      });
    }

    const container = this.containerRef.nativeElement;
    container.addEventListener('mousemove', this.onMouseMove.bind(this));
    container.addEventListener('mouseenter', () => this.isMouseInside = true);
    container.addEventListener('mouseleave', () => {
      this.isMouseInside = false;
      this.hoveredTagIndex.set(null);
    });

    this.animate();
  }

  private onMouseMove(e: MouseEvent): void {
    const container = this.containerRef.nativeElement;
    const rect = container.getBoundingClientRect();
    
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    this.mouseX = e.clientX - cx;
    this.mouseY = e.clientY - cy;

    this.currentSpeedX = (this.mouseX / (rect.width / 2)) * 0.025;
    this.currentSpeedY = -(this.mouseY / (rect.height / 2)) * 0.025;

    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    
    let foundHoverIndex: number | null = null;
    let closestZ = -Infinity;

    for (let i = 0; i < this.tags.length; i++) {
      const tag = this.tags[i];
      if (tag.px !== undefined && tag.py !== undefined && tag.w !== undefined && tag.h !== undefined) {
        const left = tag.px - tag.w / 2;
        const top = tag.py - tag.h / 2;
        if (
          localX >= left && localX <= left + tag.w &&
          localY >= top && localY <= top + tag.h
        ) {
          if (tag.z > closestZ) {
            closestZ = tag.z;
            foundHoverIndex = i;
          }
        }
      }
    }
    
    this.hoveredTagIndex.set(foundHoverIndex);
  }

  private rotateX(tag: Tag3D, angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const y = tag.y * cos - tag.z * sin;
    const z = tag.z * cos + tag.y * sin;
    tag.y = y;
    tag.z = z;
  }

  private rotateY(tag: Tag3D, angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = tag.x * cos - tag.z * sin;
    const z = tag.z * cos + tag.x * sin;
    tag.x = x;
    tag.z = z;
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    const size = Math.min(this.containerRef.nativeElement.clientWidth, 500);
    this.ctx.clearRect(0, 0, size, size);

    let speedX = this.autoSpeedX;
    let speedY = this.autoSpeedY;

    if (this.isMouseInside) {
      speedX = this.currentSpeedX;
      speedY = this.currentSpeedY;
    }

    const sortedIndices = Array.from({ length: this.tags.length }, (_, i) => i);
    sortedIndices.sort((a, b) => this.tags[a].z - this.tags[b].z);

    this.tags.forEach(tag => {
      if (this.hoveredTagIndex() === null) {
        this.rotateY(tag, speedX);
        this.rotateX(tag, speedY);
      } else {
        this.rotateY(tag, speedX * 0.15);
        this.rotateX(tag, speedY * 0.15);
      }
    });

    sortedIndices.forEach(idx => {
      const tag = this.tags[idx];
      const isHovered = (this.hoveredTagIndex() === idx);

      const scale = this.focalLength / (this.focalLength + tag.z);
      const px = tag.x * scale + size / 2;
      const py = tag.y * scale + size / 2;

      const opacity = (tag.z + this.radius) / (2 * this.radius) * 0.7 + 0.3;

      const fontSize = Math.round((isHovered ? 14 : 12) * scale);
      this.ctx.font = `bold ${fontSize}px var(--font-heading)`;
      
      const textWidth = this.ctx.measureText(tag.text).width;
      const cardW = textWidth + 18;
      const cardH = fontSize + 12;

      tag.px = px;
      tag.py = py;
      tag.w = cardW;
      tag.h = cardH;

      this.ctx.save();
      this.ctx.translate(px, py);

      if (isHovered) {
        this.ctx.shadowColor = tag.color;
        this.ctx.shadowBlur = 15;
      }

      this.ctx.fillStyle = isHovered 
        ? 'rgba(10, 15, 26, 0.95)' 
        : `rgba(13, 20, 33, ${opacity * 0.55})`;
      this.ctx.strokeStyle = isHovered 
        ? tag.color 
        : `rgba(255, 255, 255, ${opacity * 0.08})`;
      this.ctx.lineWidth = isHovered ? 1.5 : 1;

      this.ctx.beginPath();
      this.roundRect(this.ctx, -cardW / 2, -cardH / 2, cardW, cardH, 8);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = isHovered ? '#ffffff' : `rgba(240, 244, 248, ${opacity})`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText(tag.text, 0, 0);

      this.ctx.restore();
    });
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
}
