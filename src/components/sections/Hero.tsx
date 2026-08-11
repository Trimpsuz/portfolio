import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Code2, Mail } from 'lucide-react';
import { useRef } from 'react';
import { LocalTime } from '../LocalTime';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const age = new Date().getFullYear() - 2006;

  useGSAP(
    () => {
      const elements = gsap.utils.toArray<HTMLElement>('[data-hero-reveal]', sectionRef.current);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(elements, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.timeline().fromTo(elements, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.1 });
    },
    { scope: sectionRef },
  );

  return (
    <section className="hero" ref={sectionRef} aria-labelledby="hero-heading">
      <div className="hero__content">
        <p className="hero__eyebrow" data-hero-reveal>
          About
        </p>
        <h1 id="hero-heading" data-hero-reveal>
          trimpsuz
        </h1>
        <div className="hero__tagline-container" data-hero-reveal>
          <p className="hero__tagline">A {age} year old software developer from Finland.</p>
          <LocalTime />
        </div>
        <div className="hero__links" data-hero-reveal aria-label="Primary links">
          <a href="https://github.com/Trimpsuz" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Code2 aria-hidden="true" size={20} />
          </a>
          <a href="mailto:me@trimpsuz.dev" aria-label="Email">
            <Mail aria-hidden="true" size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
