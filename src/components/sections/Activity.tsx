import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { getCurrent, getSummary, type TestaustimeCurrent, type TestaustimeSummary, getLanguageName, groupLanguagesByPrettyName } from '../../lib/testaustime';

gsap.registerPlugin(ScrollTrigger);

type StatCounterProps = {
  label: string;
  target: number;
  suffix?: string;
};

function StatCounter({ label, target, suffix = '' }: StatCounterProps) {
  const statRef = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useGSAP(
    () => {
      const value = { val: 0 };
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.to(value, {
        val: target,
        duration: reduced ? 0.01 : 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: statRef.current, start: 'top 80%', once: true },
        onUpdate: () => setDisplay(Math.round(value.val)),
      });
    },
    { dependencies: [target], scope: statRef },
  );

  return (
    <div className="activity-stat" ref={statRef}>
      <strong>
        {display.toLocaleString()}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

function LanguageBar({ language, seconds, maxSeconds }: { language: string; seconds: number; maxSeconds: number }) {
  const barRef = useRef<HTMLSpanElement>(null);
  const percent = maxSeconds ? (seconds / maxSeconds) * 100 : 0;

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.to(barRef.current, {
        width: `${percent}%`,
        duration: reduced ? 0.01 : 1.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: barRef.current, start: 'top 88%', once: true },
      });
    },
    { dependencies: [percent], scope: barRef },
  );

  return (
    <li className="language-bar">
      <div>
        <span>{language}</span>
        <span>{Math.round(seconds / 3600).toLocaleString()} h</span>
      </div>
      <span className="language-bar__track">
        <span className="language-bar__fill" ref={barRef} />
      </span>
    </li>
  );
}

export function Activity() {
  const [summary, setSummary] = useState<TestaustimeSummary | null>(null);
  const [current, setCurrent] = useState<TestaustimeCurrent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    void Promise.all([getSummary(), getCurrent()])
      .then(([nextSummary, nextCurrent]) => {
        setSummary(nextSummary);
        setCurrent(nextCurrent);
      })
      .catch(() => setError(true));
  }, []);

  const totalHours = Math.round((summary?.all_time.total ?? 0) / 3600);
  const monthHours = Math.round((summary?.last_month.total ?? 0) / 3600);
  const languages = groupLanguagesByPrettyName(summary?.all_time.languages ?? {})
    .filter(([language, seconds]) => Boolean(language) && language !== 'Unknown' && language !== 'Plain Text' && seconds > 0)
    .sort(([, left], [, right]) => right - left)
    .slice(0, 5);
  const topLanguage = languages[0]?.[1] ?? 0;

  return (
    <section className="activity" aria-labelledby="activity-heading">
      <div className="section-heading">
        <p className="section-heading__eyebrow">Statistics</p>
        <h2 id="activity-heading">Time in the editor</h2>
      </div>
      {error ? (
        <p className="activity__error">Activity data is temporarily unavailable</p>
      ) : (
        <div className="activity__content">
          <div className="activity__stats" aria-label="Coding activity statistics">
            <StatCounter label="tracked" target={totalHours} suffix=" h" />
            <StatCounter label="this month" target={monthHours} suffix=" h" />
            <div className="activity-stat activity-stat--text">
              <strong>{current ? 'Coding now' : 'Offline'}</strong>
              <span>{current ? `${current.heartbeat.project_name}: ${getLanguageName(current.heartbeat.language)}` : 'No active session'}</span>
            </div>
          </div>
          <ol className="language-bars" aria-label="Most tracked languages">
            {languages.map(([language, seconds]) => (
              <LanguageBar key={language} language={language} seconds={seconds} maxSeconds={topLanguage} />
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
