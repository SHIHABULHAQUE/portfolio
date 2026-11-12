import { Component, ElementRef, OnDestroy, ViewChild, afterNextRender } from '@angular/core';
import { onTick, prefersReducedMotion } from '../../shared/utils/ticker';

/**
 * The 3D backdrop: one cloud of glowing particles, drawn with raw WebGL (no library).
 * As the page scrolls from section to section the cloud re-forms into a new shape:
 * sphere, knot, double helix, lattice, wave, galaxy. It also leans toward the pointer.
 */

const VERTEX = `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aSeed;
uniform float uMix;
uniform float uTime;
uniform float uSize;
uniform float uAspect;
uniform float uZoom;
uniform vec2 uOffset;
uniform mat3 uRot;
varying vec3 vPos;
varying float vSeed;
varying float vFade;

void main() {
  // Each particle leaves and arrives at its own moment, so shapes dissolve rather than slide
  float m = clamp(uMix * 1.5 - aSeed * 0.5, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec3 p = mix(aFrom, aTo, m);

  // Mid-flight the cloud bursts outward a little
  float burst = sin(m * 3.14159);
  p += burst * 0.45 * vec3(sin(aSeed * 91.7 + uTime), cos(aSeed * 47.3 + uTime * 1.3), sin(aSeed * 13.1 - uTime));

  // Idle shimmer
  p += 0.018 * vec3(sin(uTime * 0.9 + aSeed * 40.0), cos(uTime * 0.7 + aSeed * 70.0), sin(uTime * 0.6 + aSeed * 100.0));

  p = uRot * p;
  float z = p.z + 3.2;
  vec2 proj = p.xy / z * 1.9 * uZoom;
  gl_Position = vec4(proj.x / uAspect + uOffset.x, proj.y + uOffset.y, 0.0, 1.0);
  gl_PointSize = uSize * (0.45 + aSeed * 1.1) / z;

  vPos = p;
  vSeed = aSeed;
  vFade = smoothstep(4.6, 2.2, z);
}
`;

const FRAGMENT = `
precision mediump float;
uniform float uAlpha;
varying vec3 vPos;
varying float vSeed;
varying float vFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;

  vec3 cyan = vec3(0.13, 0.88, 1.0);
  vec3 violet = vec3(0.48, 0.38, 1.0);
  vec3 pink = vec3(1.0, 0.30, 0.62);
  float t = smoothstep(-1.0, 1.0, vPos.y * 0.8 + vPos.x * 0.5);
  vec3 col = mix(violet, cyan, t);
  col = mix(col, pink, smoothstep(0.72, 1.0, vSeed));

  float alpha = a * uAlpha * (0.35 + 0.65 * vFade);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

/** Section ids in page order; each one owns a shape, a horizontal position and a brightness. */
const STOPS = [
  { id: 'top', x: 0.5, alpha: 1.0 },
  { id: 'about', x: -0.55, alpha: 0.6 },
  { id: 'experience', x: 0.58, alpha: 0.6 },
  { id: 'projects', x: 0.0, alpha: 0.32 },
  { id: 'skills', x: -0.55, alpha: 0.5 },
  { id: 'contact', x: 0.5, alpha: 0.75 }
];

type Shape = (i: number, n: number) => [number, number, number];

const TAU = Math.PI * 2;
const rnd = Math.random;

const tiltX = (p: [number, number, number], angle: number): [number, number, number] => {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};

const SHAPES: Shape[] = [
  // Sphere with a loose halo
  (i, n) => {
    const y = 1 - (i / (n - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = i * 2.39996323;
    // Mostly shell, plus a loose outer halo and a faint core so it reads as a volume
    const r = i % 9 === 0 ? 1.15 + rnd() * 0.45 : i % 5 === 0 ? Math.cbrt(rnd()) * 0.92 : 1 + (rnd() - 0.5) * 0.05;
    return [Math.cos(theta) * ring * r, y * r, Math.sin(theta) * ring * r];
  },
  // Trefoil knot
  (i, n) => {
    const t = (i / n) * TAU;
    const r = 0.68 + 0.3 * Math.cos(3 * t);
    const j = () => (rnd() - 0.5) * 0.16;
    return [r * Math.cos(2 * t) + j(), r * Math.sin(2 * t) + j(), -0.34 * Math.sin(3 * t) + j()];
  },
  // Double helix with rungs
  (i, n) => {
    const kind = i % 4;
    const t = kind === 3 ? Math.round(rnd() * 22) / 22 : i / n;
    const angle = t * Math.PI * 5;
    const y = (t - 0.5) * 2.5;
    const a: [number, number, number] = [0.5 * Math.cos(angle), y, 0.5 * Math.sin(angle)];
    if (kind === 3) {
      const k = rnd() * 2 - 1;
      return [a[0] * k, y, a[2] * k];
    }
    const side = kind % 2 ? -1 : 1;
    const j = () => (rnd() - 0.5) * 0.05;
    return [a[0] * side + j(), y + j(), a[2] * side + j()];
  },
  // Lattice: the edges of a 3 x 3 x 3 grid of cubes
  () => {
    const pick = () => [-0.78, -0.26, 0.26, 0.78][Math.floor(rnd() * 4)];
    const along = (rnd() * 2 - 1) * 0.78;
    const axis = Math.floor(rnd() * 3);
    const p: [number, number, number] = [pick(), pick(), pick()];
    p[axis] = along;
    return p;
  },
  // Rolling wave
  (i, n) => {
    const side = Math.ceil(Math.sqrt(n));
    const x = ((i % side) / side - 0.5) * 3.4;
    const z = (Math.floor(i / side) / side - 0.5) * 3.4;
    const y = 0.2 * Math.sin(x * 2.6) * Math.cos(z * 2.6) + 0.1 * Math.sin(z * 4.0 + x);
    return tiltX([x, y - 0.1, z], 0.5);
  },
  // Spiral galaxy
  (i) => {
    const arm = i % 3;
    const r = Math.pow(rnd(), 0.65) * 1.45;
    const angle = (arm * TAU) / 3 + r * 3.4 + (rnd() - 0.5) * 0.55;
    const y = (rnd() - 0.5) * 0.14 * (1.6 - r);
    return tiltX([Math.cos(angle) * r, y, Math.sin(angle) * r], 1.0);
  }
];

@Component({
  selector: 'app-scene',
  standalone: true,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: [`
    canvas {
      position: fixed;
      inset: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0;
      transition: opacity 1.4s ease-out;
    }
    canvas.on { opacity: 1; }
  `]
})
export class SceneComponent implements OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private cleanup?: () => void;

  constructor() {
    afterNextRender(() => {
      // Let the page paint first; the scene is decoration
      const start = () => this.init();
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      idle ? idle(start, { timeout: 600 }) : setTimeout(start, 120);
    });
  }

  private init(): void {
    const canvas = this.canvasRef.nativeElement;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const small = window.innerWidth < 900;
    const count = small ? 5000 : 12000;

    // One buffer per shape; morphing just re-points the two position attributes
    const buffers = SHAPES.map(shape => {
      const data = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) data.set(shape(i, count), i * 3);
      const buffer = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return buffer;
    });

    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = rnd();
    const seedBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    const aSeed = gl.getAttribLocation(program, 'aSeed');
    gl.enableVertexAttribArray(aSeed);
    gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0);

    const aFrom = gl.getAttribLocation(program, 'aFrom');
    const aTo = gl.getAttribLocation(program, 'aTo');
    gl.enableVertexAttribArray(aFrom);
    gl.enableVertexAttribArray(aTo);
    let bound = -1;
    const bind = (segment: number) => {
      if (segment === bound) return;
      bound = segment;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[segment]);
      gl.vertexAttribPointer(aFrom, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[Math.min(segment + 1, buffers.length - 1)]);
      gl.vertexAttribPointer(aTo, 3, gl.FLOAT, false, 0, 0);
    };

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uMix = uniform('uMix'), uTime = uniform('uTime'), uSize = uniform('uSize'), uAspect = uniform('uAspect');
    const uZoom = uniform('uZoom'), uOffset = uniform('uOffset'), uRot = uniform('uRot'), uAlpha = uniform('uAlpha');

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // additive: overlapping particles glow
    gl.clearColor(0, 0, 0, 0);

    let width = 0, height = 0, narrow = false;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      narrow = width < 900;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uAspect, width / height);
      gl.uniform1f(uZoom, Math.min(1, (width / height) * 1.15));
      gl.uniform1f(uSize, 14 * dpr * Math.max(0.7, Math.min(width, height) / 900));
    };

    // Where each section starts, in page pixels
    let tops: number[] = [];
    const measure = () => {
      tops = STOPS.map(stop => {
        const el = document.getElementById(stop.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
    };

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / width) * 2 - 1;
      pointer.ty = (e.clientY / height) * 2 - 1;
    };

    const still = prefersReducedMotion();
    const t0 = performance.now();
    let position = 0; // continuous: 2.4 means "40% of the way from shape 2 to shape 3"
    let first = true;

    const frame = (scrollY: number) => {
      if (document.hidden) return;

      // Which section is in view, and how far through it are we?
      const probe = scrollY + height * 0.35;
      let i = 0;
      while (i < tops.length - 1 && tops[i + 1] <= probe) i++;
      let target = i;
      if (i < tops.length - 1) {
        const through = (probe - tops[i]) / Math.max(1, tops[i + 1] - tops[i]);
        target += Math.min(1, Math.max(0, (through - 0.45) / 0.5));
      }
      position = first || still ? target : position + (target - position) * 0.07;

      const segment = Math.min(STOPS.length - 1, Math.floor(position));
      const mix = position - segment;
      const next = STOPS[Math.min(segment + 1, STOPS.length - 1)];
      const eased = mix * mix * (3 - 2 * mix);
      bind(segment);

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      const time = still ? 0 : (performance.now() - t0) / 1000;
      const yaw = time * 0.14 + scrollY * 0.0007 + pointer.x * 0.55;
      const pitch = 0.22 + pointer.y * 0.32;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
      // Rx(pitch) * Ry(yaw), column-major
      gl.uniformMatrix3fv(uRot, false, [cy, sx * sy, -cx * sy, 0, cx, sx, sy, -sx * cy, cx * cy]);

      const x = STOPS[segment].x + (next.x - STOPS[segment].x) * eased;
      const alpha = STOPS[segment].alpha + (next.alpha - STOPS[segment].alpha) * eased;
      gl.uniform2f(uOffset, narrow ? 0 : x, narrow ? 0.12 : 0);
      gl.uniform1f(uAlpha, narrow ? alpha * 0.42 : alpha);
      gl.uniform1f(uMix, mix);
      gl.uniform1f(uTime, time);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);

      if (first) {
        first = false;
        canvas.classList.add('on');
      }
    };

    resize();
    measure();

    const onResize = () => {
      resize();
      measure();
    };
    // Section positions shift when content grows (fonts, expanding cards)
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });

    const stop = onTick(frame);
    this.cleanup = () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
    };
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
