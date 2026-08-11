import { lazy, Suspense, useEffect, useState } from 'react';
import { Activity } from './components/sections/Activity';
import { Contact } from './components/sections/Contact';
import { Hero } from './components/sections/Hero';
import { HelixCardList } from './components/sections/Projects/HelixCardList';
import { ThemeToggle } from './components/ThemeToggle';
import { Cursor } from './components/Cursor';
import { Scrollbar } from './components/Scrollbar';
import { Background } from './components/Background';
import { initLenis } from './lib/lenis';

const DesktopHelix = lazy(() => import('./components/sections/Projects/Helix').then(({ Helix }) => ({ default: Helix })));

function useMediaQuery(query: string) {
  const getMatches = () => window.matchMedia(query).matches;
  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function Projects() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (isMobile || prefersReducedMotion) return <HelixCardList />;

  return (
    <Suspense
      fallback={
        <section className="helix-loading" aria-busy="true" aria-labelledby="projects-heading">
          <div className="helix-heading">
            <p className="section-heading__eyebrow">Featured</p>
            <h2 id="projects-heading">Projects</h2>
          </div>
        </section>
      }
    >
      <DesktopHelix />
    </Suspense>
  );
}

function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    return initLenis().destroy;
  }, []);

  return (
    <>
      <Background />
      <Cursor />
      <ThemeToggle />
      <Scrollbar />
      <main>
        <Hero />
        <Activity />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;
