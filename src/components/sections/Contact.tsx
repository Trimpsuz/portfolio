import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const content = sectionRef.current?.querySelector('.contact__content');
      if (!content) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(content, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        content,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <footer className="contact" ref={sectionRef} aria-labelledby="contact-heading">
      <div className="contact__content">
        <p className="section-heading__eyebrow">Contact</p>
        <h2 id="contact-heading">Let&apos;s make something</h2>
        <a className="contact__email" href="mailto:me@trimpsuz.dev">
          me@trimpsuz.dev <ArrowUpRight aria-hidden="true" size={24} />
        </a>
        <div className="contact__socials" aria-label="Social profiles">
          <p className="section-heading__eyebrow">Social:</p>
          <a href="https://github.com/Trimpsuz" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://discord.com/users/348135295922995222" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
          <a href="https://www.last.fm/user/politiikka" target="_blank" rel="noopener noreferrer">
            Last.fm
          </a>
        </div>
      </div>
      <p className="contact__footer">{`\u00A9 ${new Date().getFullYear()} trimpsuz`}</p>
    </footer>
  );
}
