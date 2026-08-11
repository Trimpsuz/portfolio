import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { subscribeToLenis } from '../lib/lenis';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotionQuery = '(prefers-reduced-motion: reduce)';
const pointerQuery = '(hover: hover) and (pointer: fine)';

export function Background() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const background = backgroundRef.current;
      const activity = document.querySelector('.activity');
      if (!background || !activity || window.matchMedia(prefersReducedMotionQuery).matches) return;

      gsap.to(background, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: activity,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    },
    { scope: backgroundRef },
  );

  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    const reducedMotion = window.matchMedia(prefersReducedMotionQuery);
    const finePointer = window.matchMedia(pointerQuery);
    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let scrollPosition = 0;

    const setLayerPositions = () => {
      background.style.setProperty('--bg-field-x', `${pointerX * -0.28}px`);
      background.style.setProperty('--bg-field-y', `${pointerY * -0.28 - scrollPosition * 0.1}px`);
      background.style.setProperty('--bg-grain-y', `${scrollPosition * 0.025}px`);
    };

    const detachLenis = subscribeToLenis(({ scroll }) => {
      scrollPosition = scroll;
    });

    const frame = () => {
      pointerX += (targetPointerX - pointerX) * 0.055;
      pointerY += (targetPointerY - pointerY) * 0.055;
      setLayerPositions();
      frameId = window.requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      targetPointerX = (event.clientX / window.innerWidth - 0.5) * 24;
      targetPointerY = (event.clientY / window.innerHeight - 0.5) * 24;
    };

    const start = () => {
      if (reducedMotion.matches) {
        setLayerPositions();
        return;
      }
      frameId = window.requestAnimationFrame(frame);
    };

    const stop = () => {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const onMotionPreferenceChange = () => {
      stop();
      start();
    };

    setLayerPositions();
    start();
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    reducedMotion.addEventListener('change', onMotionPreferenceChange);

    return () => {
      stop();
      detachLenis();
      window.removeEventListener('pointermove', onPointerMove);
      reducedMotion.removeEventListener('change', onMotionPreferenceChange);
    };
  }, []);

  return (
    <div className="background" ref={backgroundRef} aria-hidden="true">
      <div className="background__field" />
      <div className="background__grain" />
    </div>
  );
}
