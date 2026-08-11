import { Clock3 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

const helsinkiTimeZone = 'Europe/Helsinki';

type TimeInfo = {
  differenceInMinutes: number;
  time: string;
  tooltip: string;
};

function getTimeZoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]));
  const zonedTime = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second));

  return Math.round((zonedTime - date.getTime()) / 60000);
}

function formatDifference(minutes: number) {
  const absoluteMinutes = Math.abs(minutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const remainingMinutes = absoluteMinutes % 60;
  const value = remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  return `${minutes > 0 ? '+' : '−'}${value}`;
}

function getTimeInfo(): TimeInfo {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: helsinkiTimeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now);
  const viewerTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const differenceInMinutes = getTimeZoneOffset(now, helsinkiTimeZone) - getTimeZoneOffset(now, viewerTimeZone);
  const relation = differenceInMinutes > 0 ? 'ahead of' : 'behind';
  const tooltip = differenceInMinutes === 0 ? 'Same time as you.' : `${formatDifference(differenceInMinutes).slice(1)} ${relation} your time.`;

  return { differenceInMinutes, time, tooltip };
}

export function LocalTime() {
  const [timeInfo, setTimeInfo] = useState(getTimeInfo);
  const [isOpen, setIsOpen] = useState(false);
  const timeRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    let intervalId = 0;
    const update = () => setTimeInfo(getTimeInfo());
    const millisecondsUntilNextMinute = 60_000 - (Date.now() % 60_000) + 20;
    const timeoutId = window.setTimeout(() => {
      update();
      intervalId = window.setInterval(update, 60_000);
    }, millisecondsUntilNextMinute);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !timeRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <button
      className="hero__time"
      ref={timeRef}
      type="button"
      aria-describedby={tooltipId}
      aria-expanded={isOpen}
      data-open={isOpen || undefined}
      data-hero-reveal
      onClick={() => setIsOpen((open) => !open)}
    >
      <Clock3 aria-hidden="true" size={15} />
      <time>{timeInfo.time}</time>
      {timeInfo.differenceInMinutes !== 0 && (
        <span className="hero__time-difference" aria-hidden="true">
          {formatDifference(timeInfo.differenceInMinutes)}
        </span>
      )}
      <span className="hero__time-tooltip" id={tooltipId} role="tooltip">
        {timeInfo.tooltip}
      </span>
    </button>
  );
}
