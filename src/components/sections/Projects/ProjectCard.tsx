import { ArrowUpRight, Code2 } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import type { Project } from '../../../data/projects';

type ProjectCardProps = Project & ComponentPropsWithoutRef<'a'>;

export const ProjectCard = forwardRef<HTMLAnchorElement, ProjectCardProps>(({ title, description, languages, url, year, className = '' }, ref) => {
  return (
    <a ref={ref} className={`project-card ${className}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${title}`}>
      <span className="project-card__topline">
        <span className="project-card__year">{year}</span>
        <ArrowUpRight className="project-card__arrow" aria-hidden="true" size={20} />
      </span>
      <span className="project-card__title">{title.toLowerCase()}</span>
      <span className="project-card__description">{description}</span>
      <span className="project-card__languages">
        <Code2 aria-hidden="true" size={15} />
        {languages.map((language) => (
          <span key={language}>{language}</span>
        ))}
      </span>
    </a>
  );
});

ProjectCard.displayName = 'ProjectCard';
