import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCallback, useRef, useState } from 'react';

const pointerQuery = '(hover: hover) and (pointer: fine)';
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

const THUMB_SIZE = 12;
const INSET = 24;

function getDocMetrics() {
  const doc = document.documentElement;
  return {
    scrollTop: window.scrollY || doc.scrollTop,
    scrollHeight: doc.scrollHeight,
    clientHeight: doc.clientHeight,
  };
}

function getLenis() {
  return window.__lenis;
}

export function Scrollbar() {
  const [canHover] = useState(() => window.matchMedia(pointerQuery).matches);
  const [reduced] = useState(() => window.matchMedia(reducedMotionQuery).matches);
  const [dragging, setDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const setThumbYRef = useRef<((y: number) => void) | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;

      const setY = reduced ? (y: number) => gsap.set(thumb, { y }) : gsap.quickTo(thumb, 'y', { duration: 0.35, ease: 'power3.out' });

      setThumbYRef.current = (y: number) => {
        setY(y);
        if (!reduced) gsap.getTweensOf(thumb).forEach((tween) => tween.progress(1));
      };

      const render = () => {
        if (draggingRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = getDocMetrics();

        if (scrollHeight <= clientHeight) {
          gsap.set(track, { autoAlpha: 0 });
          return;
        }
        gsap.set(track, { autoAlpha: 1 });

        const maxScrollTop = scrollHeight - clientHeight;
        const maxThumbY = track.clientHeight - THUMB_SIZE;
        const progress = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
        setY(progress * maxThumbY);
      };

      const onScroll = () => render();
      const onResize = () => render();

      render();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);

      const ro = new ResizeObserver(onResize);
      ro.observe(document.documentElement);

      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        ro.disconnect();
        setThumbYRef.current = null;
      };
    },
    { dependencies: [reduced], scope: trackRef },
  );

  const scrollFromClientY = useCallback((clientY: number, grabOffset: number) => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const trackRect = track.getBoundingClientRect();
    const maxThumbY = trackRect.height - THUMB_SIZE;
    const rawY = clientY - trackRect.top - grabOffset;
    const clampedY = Math.min(Math.max(rawY, 0), maxThumbY);

    setThumbYRef.current?.(clampedY);

    const progress = maxThumbY > 0 ? clampedY / maxThumbY : 0;
    const { scrollHeight, clientHeight } = getDocMetrics();
    const target = progress * (scrollHeight - clientHeight);

    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo({ top: target });
  }, []);

  const beginDrag = useCallback(
    (startClientY: number, grabOffset: number) => {
      draggingRef.current = true;
      setDragging(true);
      document.documentElement.dataset.cursorLocked = 'true';
      document.documentElement.dataset.cursorState = 'hidden';

      scrollFromClientY(startClientY, grabOffset);

      const onMove = (e: PointerEvent) => scrollFromClientY(e.clientY, grabOffset);
      const onUp = () => {
        draggingRef.current = false;
        setDragging(false);
        delete document.documentElement.dataset.cursorLocked;
        delete document.documentElement.dataset.cursorState;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    },
    [scrollFromClientY],
  );

  const handleThumbPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const thumb = thumbRef.current;
      if (!thumb) return;

      const thumbRect = thumb.getBoundingClientRect();
      const grabOffset = event.clientY - thumbRect.top;
      beginDrag(event.clientY, grabOffset);
    },
    [beginDrag],
  );

  const handleTrackPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.target === thumbRef.current) return;
      event.preventDefault();
      beginDrag(event.clientY, THUMB_SIZE / 2);
    },
    [beginDrag],
  );

  if (!canHover) return null;

  return (
    <div className="scrollbar-track" ref={trackRef} style={{ top: INSET, bottom: INSET }} onPointerDown={handleTrackPointerDown}>
      <div
        className="scrollbar-thumb"
        ref={thumbRef}
        onPointerDown={handleThumbPointerDown}
        data-dragging={dragging || undefined}
        data-cursor-interactive
        role="scrollbar"
        aria-orientation="vertical"
        aria-controls="root"
      />
    </div>
  );
}
