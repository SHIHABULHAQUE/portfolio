let pending: Promise<void> | null = null;

/** Resolves once the index.html preloader has started fading out (browser only). */
export function whenPreloaderDone(): Promise<void> {
  if (pending) return pending;

  pending = new Promise(resolve => {
    const el = document.getElementById('app-preloader');
    if (!el || el.classList.contains('loaded')) return resolve();

    const observer = new MutationObserver(() => {
      if (el.classList.contains('loaded')) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
  });

  return pending;
}
