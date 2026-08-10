import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

const pointerQuery = '(hover: hover) and (pointer: fine)';

export function Cursor() {
  const [canHover, setCanHover] = useState(() => window.matchMedia(pointerQuery).matches);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(pointerQuery);
    const update = () => setCanHover(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      const cursor = cursorRef.current;
      if (!cursor || !canHover) return;

      gsap.set(cursor, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3.out' });
      const move = (event: MouseEvent) => {
        xTo(event.clientX);
        yTo(event.clientY);
      };

      const activate = () => {
        document.documentElement.dataset.cursorState = 'interactive';
      };
      const deactivate = () => {
        document.documentElement.dataset.cursorState = 'default';
      };
      const closestInteractive = (target: EventTarget | null) => (target instanceof Element ? target.closest('a, button, [data-cursor-interactive]') : null);
      const onPointerOver = (event: PointerEvent) => {
        if (document.documentElement.dataset.cursorLocked) return;
        if (closestInteractive(event.target)) activate();
      };
      const onPointerOut = (event: PointerEvent) => {
        if (document.documentElement.dataset.cursorLocked) return;
        const from = closestInteractive(event.target);
        const to = closestInteractive(event.relatedTarget);
        if (from && from !== to) deactivate();
      };
      const onPointerLeave = (event: PointerEvent) => {
        if (event.relatedTarget === null) {
          document.documentElement.dataset.cursorState = 'hidden';
        }
      };
      const onPointerEnter = () => {
        if (document.documentElement.dataset.cursorState === 'hidden') {
          deactivate();
        }
      };

      window.addEventListener('pointermove', move);
      document.addEventListener('pointerover', onPointerOver);
      document.addEventListener('pointerout', onPointerOut);
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
      document.documentElement.addEventListener('pointerenter', onPointerEnter);

      return () => {
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerover', onPointerOver);
        document.removeEventListener('pointerout', onPointerOut);
        document.documentElement.removeEventListener('pointerleave', onPointerLeave);
        document.documentElement.removeEventListener('pointerenter', onPointerEnter);
        delete document.documentElement.dataset.cursorState;
      };
    },
    { dependencies: [canHover] },
  );

  if (!canHover) return null;

  return <span className="cursor" data-custom-cursor ref={cursorRef} aria-hidden="true" />;
}
