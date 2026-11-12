/**
 * One requestAnimationFrame loop for the whole page.
 * Subscribers get the current scroll position and a smoothed scroll velocity (px/frame).
 * The loop sleeps while nobody is subscribed.
 */
type Tick = (scrollY: number, velocity: number) => void;

const subs = new Set<Tick>();
let frame = 0;
let lastY = 0;
let velocity = 0;

function loop(): void {
  const y = window.scrollY;
  velocity += (y - lastY - velocity) * 0.18;
  if (Math.abs(velocity) < 0.01) velocity = 0;
  lastY = y;
  subs.forEach(fn => fn(y, velocity));
  frame = requestAnimationFrame(loop);
}

export function onTick(fn: Tick): () => void {
  subs.add(fn);
  if (!frame) {
    lastY = window.scrollY;
    frame = requestAnimationFrame(loop);
  }
  return () => {
    subs.delete(fn);
    if (!subs.size && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

export const prefersReducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const hasFinePointer = (): boolean => matchMedia('(hover: hover) and (pointer: fine)').matches;
