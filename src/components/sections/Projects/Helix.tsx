import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { projects } from '../../../data/projects';
import { depthFilter, depthOf, helixAngle, helixTransform, wrap } from '../../../lib/helix';
import { ProjectCard } from './ProjectCard';

gsap.registerPlugin(ScrollTrigger);

type HelixViewport = {
  radius: number;
  perspective: number;
  span: number;
  cardWidth: number;
  cardHeight: number;
};

const HELIX_TURNS = 1.2;
const CENTER_ANGLE_OFFSET = (1 - HELIX_TURNS) * Math.PI;
const CARD_SCALE = 2;

const getRadius = (cardWidth: number, cardsPerStrand: number) => {
  const angularStep = (HELIX_TURNS * 2 * Math.PI) / Math.max(cardsPerStrand, 2);
  const projectedStep = Math.max(0.25, Math.sin(Math.min(angularStep, Math.PI / 2)));
  return (cardWidth / projectedStep) * 1.08;
};

const getViewport = (cardsPerStrand: number): HelixViewport => {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  if (window.innerWidth >= 1440) {
    const cardHeight = 244;
    const cardWidth = 304;
    const radius = getRadius(cardWidth, cardsPerStrand);
    const span = Math.max(vh + cardHeight * 1.6, cardsPerStrand * cardHeight * 0.72);
    return {
      radius,
      perspective: Math.max(1580, radius * 3.6),
      span,
      cardWidth,
      cardHeight,
    };
  }

  if (window.innerWidth >= 1024) {
    const cardHeight = 228;
    const cardWidth = 276;
    const radius = getRadius(cardWidth, cardsPerStrand);
    const span = Math.max(vh + cardHeight * 1.6, cardsPerStrand * cardHeight * 0.72);
    return {
      radius,
      perspective: Math.max(1320, radius * 3.6),
      span,
      cardWidth,
      cardHeight,
    };
  }

  const cardHeight = 212;
  const cardWidth = 248;
  const radius = getRadius(cardWidth, cardsPerStrand);
  const span = Math.max(vh + cardHeight * 1.6, cardsPerStrand * cardHeight * 0.72);
  return {
    radius,
    perspective: Math.max(1100, radius * 3.6),
    span,
    cardWidth,
    cardHeight,
  };
};

const helixCards = ([0, 1] as const).flatMap((strand) =>
  projects.map((project, projectIndex) => ({
    ...project,
    strand,
    projectIndex,
    instanceId: `${project.id}-${strand}`,
  })),
);

export function Helix() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const cardsPerStrand = projects.length;
  const scrollLength = Math.max(300, cardsPerStrand * 70);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = helixCards.flatMap((card) => {
      const el = cardRefs.current[card.instanceId];
      if (!el) return [];

      return [
        {
          el,
          base: card.projectIndex + 0.5,
          phase: (card.strand / 2) * 2 * Math.PI,
          perStrand: projects.length,
          active: false,
        },
      ];
    });

    let scrollProgress = 0;
    const trigger = ScrollTrigger.create({
      trigger: section,
      pin: true,
      scrub: true,
      start: 'top top',
      end: `+=${scrollLength}%`,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    let viewport = getViewport(cardsPerStrand);
    const applyViewport = () => {
      viewport = getViewport(cardsPerStrand);
      section.style.setProperty('--helix-perspective', `${viewport.perspective}px`);
      section.style.setProperty('--helix-card-width', `${viewport.cardWidth}px`);
      section.style.setProperty('--helix-card-height', `${viewport.cardHeight}px`);
      ScrollTrigger.refresh();
    };

    let activeCount = 0;

    const cleanupListeners = cards.map((card) => {
      const setActive = (active: boolean) => {
        if (card.active === active) return;
        card.active = active;
        activeCount += active ? 1 : -1;
        card.el.classList.toggle('is-active', active);
      };
      const onPointerEnter = () => setActive(true);
      const onPointerLeave = () => setActive(false);

      const onFocus = () => setActive(true);
      const onBlur = () => setActive(false);

      card.el.addEventListener('mouseenter', onPointerEnter);
      card.el.addEventListener('mouseleave', onPointerLeave);
      card.el.addEventListener('focus', onFocus);
      card.el.addEventListener('blur', onBlur);

      return () => {
        card.el.removeEventListener('mouseenter', onPointerEnter);
        card.el.removeEventListener('mouseleave', onPointerLeave);
        card.el.removeEventListener('focus', onFocus);
        card.el.removeEventListener('blur', onBlur);
      };
    });

    applyViewport();
    window.addEventListener('resize', applyViewport);

    const idleSpeed = 0.05;
    const idleEaseRate = 2;
    let frameId = 0;
    let lastTime = performance.now();
    let idlePhase = 0;
    let idleSpeedFactor = 1;

    const frame = (now: number) => {
      const dt = Math.min(0.1, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;

      const targetSpeedFactor = activeCount > 0 ? 0 : 1;
      idleSpeedFactor += (targetSpeedFactor - idleSpeedFactor) * Math.min(1, idleEaseRate * dt);
      idlePhase += idleSpeed * idleSpeedFactor * dt;

      cards.forEach((card) => {
        const progress = wrap(card.base + idlePhase + scrollProgress * card.perStrand, card.perStrand) / card.perStrand;
        const angle = helixAngle(progress, card.phase, HELIX_TURNS) + CENTER_ANGLE_OFFSET;
        const depth = depthOf(angle);
        const y = (progress - 0.5) * viewport.span;
        const scale = card.active ? 1.08 : 1;

        card.el.style.transform = helixTransform(angle, y, viewport.radius, scale, CARD_SCALE);
        card.el.style.filter = depthFilter(card.active ? 1 : depth);
      });
      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', applyViewport);
      trigger.kill();
      cleanupListeners.forEach((cleanup) => cleanup());
    };
  }, [cardsPerStrand, scrollLength]);

  return (
    <section className="helix-section" ref={sectionRef} aria-labelledby="projects-heading">
      <div className="helix-heading">
        <p className="section-heading__eyebrow">Featured</p>
        <h2 id="projects-heading">Projects</h2>
      </div>
      <div className="helix-fade">
        <div className="helix-stage">
          <div className="helix-world">
            {helixCards.map(({ instanceId, ...project }) => {
              return (
                <ProjectCard
                  className="helix-card"
                  key={instanceId}
                  ref={(element) => {
                    cardRefs.current[instanceId] = element;
                  }}
                  {...project}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
