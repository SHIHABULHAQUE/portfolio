import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, NgZone, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-three-background',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas class="webgl-canvas"></canvas>`,
  styles: [`
    .webgl-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      background: linear-gradient(to bottom, #05070a 0%, #0b0e14 100%);
    }
  `]
})
export class ThreeBackgroundComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;

  // Three.js groups and meshes
  private mainGroup!: THREE.Group;
  private starfield!: THREE.Points;
  private globeGroup!: THREE.Group;
  private innerGlobe!: THREE.Mesh;
  private outerPoints!: THREE.Points;
  
  // Orbits and tags
  private orbits: {
    orbitLine: THREE.Line;
    orbs: { mesh: THREE.Mesh; sprite: THREE.Sprite; speed: number; angle: number; radius: number; tiltX: number; tiltZ: number }[];
  }[] = [];

  // Mouse interactivity
  private mouse = { x: 0, y: 0 };
  private targetMouse = { x: 0, y: 0 };

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Wrap WebGL scene generation in a platform-browser check
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.initThree();
        this.createStarfield();
        this.createGlobe();
        this.createOrbits();
        this.animate();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Dispose resources on browser destruction
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('mousemove', this.onMouseMove);

        if (this.renderer) {
          this.renderer.dispose();
        }

        this.scene.clear();
      });
    }
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2('#05070a', 0.05);

    // Setup Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 8;

    // Setup Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Setup Main Animation Group
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Event listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    this.adjustLayout();
  }

  private createStarfield(): void {
    const starsCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 35;     // X
      positions[i + 1] = (Math.random() - 0.5) * 35; // Y
      positions[i + 2] = (Math.random() - 0.5) * 35; // Z

      const r = 0.8 + Math.random() * 0.2;
      const g = 0.9 + Math.random() * 0.1;
      const b = 1.0;
      colors[i] = r;
      colors[i + 1] = g;
      colors[i + 2] = b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      map: texture,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.starfield = new THREE.Points(geometry, material);
    this.mainGroup.add(this.starfield);
  }

  private createGlobe(): void {
    this.globeGroup = new THREE.Group();
    this.mainGroup.add(this.globeGroup);

    const innerGeom = new THREE.SphereGeometry(2.0, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    this.innerGlobe = new THREE.Mesh(innerGeom, innerMat);
    this.globeGroup.add(this.innerGlobe);

    const outerGeom = new THREE.SphereGeometry(2.1, 36, 36);
    const pointsCount = outerGeom.attributes['position'].count;
    const colors = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      colors[i * 3] = 0.0;
      colors[i * 3 + 1] = 0.94;
      colors[i * 3 + 2] = 1.0;
    }
    outerGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(0,240,255,1)');
    grad.addColorStop(0.5, 'rgba(0,240,255,0.4)');
    grad.addColorStop(1, 'rgba(0,240,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const pointTexture = new THREE.CanvasTexture(canvas);

    const outerMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      map: pointTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.outerPoints = new THREE.Points(outerGeom, outerMat);
    this.globeGroup.add(this.outerPoints);
  }

  private createOrbits(): void {
    const techStacks = [
      { name: 'Angular', color: '#ff0055', radius: 3.2, speed: 0.004, tiltX: 0.4, tiltZ: 0.2 },
      { name: 'TypeScript', color: '#007acc', radius: 3.2, speed: 0.004, tiltX: 0.4, tiltZ: 0.2 },
      { name: '.NET', color: '#68217a', radius: 3.8, speed: -0.003, tiltX: -0.3, tiltZ: 0.4 },
      { name: 'SQL Server', color: '#f25f22', radius: 4.4, speed: 0.002, tiltX: 0.2, tiltZ: -0.5 },
      { name: 'Azure', color: '#0078d4', radius: 3.8, speed: -0.003, tiltX: -0.3, tiltZ: 0.4 },
      { name: 'Git', color: '#f1502f', radius: 4.4, speed: 0.002, tiltX: 0.2, tiltZ: -0.5 }
    ];

    const groupedOrbits = [
      { radius: 3.2, tiltX: 0.4, tiltZ: 0.2, items: [techStacks[0], techStacks[1]] },
      { radius: 3.8, tiltX: -0.3, tiltZ: 0.4, items: [techStacks[2], techStacks[4]] },
      { radius: 4.4, tiltX: 0.2, tiltZ: -0.5, items: [techStacks[3], techStacks[5]] }
    ];

    groupedOrbits.forEach((config) => {
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const pt = new THREE.Vector3(
          Math.cos(theta) * config.radius,
          0,
          Math.sin(theta) * config.radius
        );
        points.push(pt);
      }

      const orbitLineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const orbitLineMat = new THREE.LineBasicMaterial({
        color: 0x233554,
        transparent: true,
        opacity: 0.2
      });

      const orbitLine = new THREE.Line(orbitLineGeom, orbitLineMat);
      orbitLine.rotation.x = config.tiltX;
      orbitLine.rotation.z = config.tiltZ;
      this.globeGroup.add(orbitLine);

      const orbs: any[] = [];

      config.items.forEach((item, index) => {
        const initialAngle = (index / config.items.length) * Math.PI * 2;

        const orbGeom = new THREE.SphereGeometry(0.08, 12, 12);
        const orbMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(item.color),
          transparent: true,
          opacity: 0.8
        });
        const orbMesh = new THREE.Mesh(orbGeom, orbMat);
        this.globeGroup.add(orbMesh);

        const textSprite = this.createTextSprite(item.name, item.color);
        this.globeGroup.add(textSprite);

        orbs.push({
          mesh: orbMesh,
          sprite: textSprite,
          speed: item.speed,
          angle: initialAngle,
          radius: config.radius,
          tiltX: config.tiltX,
          tiltZ: config.tiltZ
        });
      });

      this.orbits.push({
        orbitLine,
        orbs
      });
    });
  }

  private createTextSprite(text: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(5, 7, 10, 0.85)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    this.roundRect(ctx, 4, 4, 248, 56, 12, true, true);

    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.4, 0.35, 1.0);
    return sprite;
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number,
    fill: boolean, stroke: boolean
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    this.starfield.rotation.y += 0.0003;
    this.starfield.rotation.x += 0.0001;

    this.innerGlobe.rotation.y += 0.0015;
    this.innerGlobe.rotation.x += 0.0005;

    this.outerPoints.rotation.y -= 0.001;
    this.outerPoints.rotation.x -= 0.0003;

    this.orbits.forEach(orbit => {
      orbit.orbs.forEach(orb => {
        orb.angle += orb.speed;

        const localPos = new THREE.Vector3(
          Math.cos(orb.angle) * orb.radius,
          0,
          Math.sin(orb.angle) * orb.radius
        );

        localPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), orb.tiltX);
        localPos.applyAxisAngle(new THREE.Vector3(0, 0, 1), orb.tiltZ);

        orb.mesh.position.copy(localPos);
        orb.sprite.position.copy(localPos).add(new THREE.Vector3(0, 0.25, 0));
      });
    });

    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    this.globeGroup.rotation.y = this.mouse.x * 0.3;
    this.globeGroup.rotation.x = -this.mouse.y * 0.3;

    this.renderer.render(this.scene, this.camera);
  }

  private onMouseMove(event: MouseEvent): void {
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.adjustLayout();
  }

  private adjustLayout(): void {
    if (window.innerWidth < 768) {
      this.globeGroup.position.set(0, 1.2, -1);
      this.globeGroup.scale.set(0.7, 0.7, 0.7);
    } else if (window.innerWidth < 1200) {
      this.globeGroup.position.set(1.5, 0, 0);
      this.globeGroup.scale.set(0.9, 0.9, 0.9);
    } else {
      this.globeGroup.position.set(2.8, 0, 0);
      this.globeGroup.scale.set(1.0, 1.0, 1.0);
    }
  }
}
