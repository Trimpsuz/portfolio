import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function getLenis() {
  return window.__lenis;
}

export function subscribeToLenis(listener: (lenis: Lenis) => void) {
  let subscribedLenis: Lenis | undefined;

  const attach = () => {
    const lenis = getLenis();
    if (!lenis || lenis === subscribedLenis) return;

    subscribedLenis?.off('scroll', listener);
    subscribedLenis = lenis;
    lenis.on('scroll', listener);
    listener(lenis);
  };

  attach();
  window.addEventListener('lenisready', attach);

  return () => {
    window.removeEventListener('lenisready', attach);
    subscribedLenis?.off('scroll', listener);
  };
}

export function initLenis() {
  const lenis = new Lenis({ autoRaf: false });
  const onTick = (time: number) => lenis.raf(time * 1000);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  window.__lenis = lenis;
  window.dispatchEvent(new Event('lenisready'));

  return {
    lenis,
    destroy() {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    },
  };
}
