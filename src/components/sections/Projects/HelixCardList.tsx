import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { projects } from '../../../data/projects';
import { ProjectCard } from './ProjectCard';

gsap.registerPlugin(ScrollTrigger);

export function HelixCardList() {
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.project-card', listRef.current);
      if (!cards.length) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y: 20 });
      const triggers = ScrollTrigger.batch(cards, {
        interval: 0.08,
        batchMax: 3,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: true,
            stagger: 0.08,
          }),
        once: true,
      });

      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { scope: listRef },
  );

  return (
    <section className="projects-section" aria-labelledby="projects-heading">
      <div className="section-heading">
        <p className="section-heading__eyebrow">Featured</p>
        <h2 id="projects-heading">Projects</h2>
      </div>
      <div className="projects-list" ref={listRef}>
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
}
