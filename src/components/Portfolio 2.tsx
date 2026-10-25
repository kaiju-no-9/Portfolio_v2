import { useEffect, useState } from 'react';
import type { PortfolioDocument, PortfolioItem, PortfolioSection } from '../portfolio/portfolio-types';
import { MarkdownContent } from './MarkdownContent';

function Eyebrow({ children }: { children?: unknown }) {
  return typeof children === 'string' ? <p className="eyebrow">{children}</p> : null;
}

function sectionBody(section: PortfolioSection): string {
  return section.markdown.replace(/^\s*#{1,6}\s+[^\n]+\n*/, '').trim();
}

function ProjectCard({ item, index }: { item: PortfolioItem; index: number }) {
  const stack = Array.isArray(item.metadata.stack) ? item.metadata.stack.filter((part): part is string => typeof part === 'string') : [];
  const repo = typeof item.metadata.repo === 'string' ? item.metadata.repo : undefined;
  const demo = typeof item.metadata.demo === 'string' ? item.metadata.demo : undefined;
  const title = item.markdown.match(/^\s*###\s+(.+)/m)?.[1] ?? item.id;
  return <article className="project-card" style={{ '--card-index': index } as React.CSSProperties}>
    <div className="project-topline"><span className="project-number">0{index + 1}</span><div className="project-links">
      {demo && <a href={demo} target="_blank" rel="noreferrer" aria-label={`Visit ${title} demo`}>↗</a>}
      {repo && <a href={repo} target="_blank" rel="noreferrer" aria-label={`${title} source code`}>⌘</a>}
    </div></div>
    <MarkdownContent className="project-copy" >{item.markdown}</MarkdownContent>
    <ul className="tag-list" aria-label={`${title} technology stack`}>{stack.map((tag) => <li key={tag}>{tag}</li>)}</ul>
  </article>;
}

function GitHubActivity({ section }: { section: PortfolioSection }) {
  const username = String(section.metadata.username ?? '');
  const [snapshot, setSnapshot] = useState<{ totalContributions: number; weeks: Array<Array<{ date: string; count: number; level: number }>> } | null>(null);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/github-activity.json`).then((response) => response.ok ? response.json() : null).then((data: unknown) => {
      if (!data || typeof data !== 'object' || !('weeks' in data) || !Array.isArray(data.weeks)) return;
      const candidate = data as { totalContributions?: unknown; weeks: unknown[] };
      if (!candidate.weeks.every((week) => Array.isArray(week) && week.every((day) => day && typeof day === 'object' && 'date' in day && 'count' in day && 'level' in day))) return;
      setSnapshot({ totalContributions: typeof candidate.totalContributions === 'number' ? candidate.totalContributions : 0, weeks: candidate.weeks as Array<Array<{ date: string; count: number; level: number }>> });
    }).catch(() => undefined);
  }, []);
  return <section className="activity-panel" aria-labelledby={`${section.id}-heading`}>
    <div className="activity-copy"><Eyebrow>{section.metadata.eyebrow}</Eyebrow><h2 id={`${section.id}-heading`}>{String(section.metadata.title ?? 'GitHub activity')}</h2>
      <MarkdownContent>{sectionBody(section)}</MarkdownContent>
      <p className="activity-note"><span className="status-dot" /> {snapshot ? `${snapshot.totalContributions.toLocaleString()} contributions in the last year` : 'Contribution data is temporarily unavailable.'}</p>
      <a className="text-link" href={`https://github.com/${encodeURIComponent(username)}`} target="_blank" rel="noreferrer">View GitHub profile <span>↗</span></a>
    </div>
    <div className="activity-visual" aria-label={snapshot ? `${snapshot.totalContributions} GitHub contributions in the last year` : 'GitHub contribution calendar'}>
      <div className="activity-head"><span>CONTRIBUTIONS</span><span>LAST 12 MONTHS</span></div>
      {snapshot ? <div className="contribution-grid" role="img" aria-label={`${snapshot.totalContributions} contributions over the last year`}>{snapshot.weeks.map((week, weekIndex) => <div className="contribution-week" key={weekIndex}>{week.map((day) => <span key={day.date} className={`contribution-day level-${Math.min(4, Math.max(0, day.level))}`} title={`${day.count} contributions on ${day.date}`} aria-label={`${day.count} contributions on ${day.date}`} />)}</div>)}</div> : <div className="activity-empty"><div className="activity-orbit">⌘</div><p>Building in public,<br />one commit at a time.</p></div>}
      <div className="activity-legend"><span>Less</span>{[0,1,2,3,4].map((level) => <i key={level} className={`level-${level}`} />)}<span>More</span></div>
    </div>
  </section>;
}

function Section({ section }: { section: PortfolioSection }) {
  const title = typeof section.metadata.title === 'string' ? section.metadata.title : undefined;
  const eyebrow = section.metadata.eyebrow;
  if (section.type === 'hero') return <section className="hero" id={section.id}>
    <div className="hero-mark" aria-hidden="true">NK<span>.</span></div>
    <div className="hero-content"><Eyebrow>ENGINEER · BUILDER · CURIOUS HUMAN</Eyebrow><MarkdownContent className="hero-markdown">{section.markdown}</MarkdownContent>
      <a className="scroll-cue" href="#featured-projects"><span className="scroll-line" />SCROLL TO EXPLORE</a>
    </div><div className="hero-side-note">BASED IN INDIA<br />AVAILABLE WORLDWIDE</div>
    <div className="hero-decor" aria-hidden="true"><span>01</span><i /></div>
  </section>;
  if (section.type === 'project-grid') return <section className="section projects-section" id={section.id}>
    <div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title ?? 'Selected work'}</h2></div><p className="section-aside">A selection of experiments and products<br />built with curiosity and care.</p></div>
    <div className="project-grid">{section.items.map((item, index) => <ProjectCard item={item} index={index} key={item.id} />)}</div>
  </section>;
  if (section.type === 'skills') return <section className="section skills-section" id={section.id}>
    <div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title ?? 'Tools I use'}</h2></div><span className="section-index">02 / TOOLKIT</span></div>
    <MarkdownContent className="skills-content">{sectionBody(section)}</MarkdownContent>
  </section>;
  if (section.type === 'github-activity') return <section className="section" id={section.id}><GitHubActivity section={section} /></section>;
  if (section.type === 'contact') return <section className="contact-section" id={section.id}>
    <div><Eyebrow>{eyebrow}</Eyebrow><h2>{title ?? 'Let’s build something useful.'}</h2><MarkdownContent>{sectionBody(section)}</MarkdownContent></div>
    <a className="contact-button" href="mailto:nishchaykumar89@gmail.com">Start a conversation <span>↗</span></a>
  </section>;
  if (section.type === 'experience') return <section className="section" id={section.id}><div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title ?? 'Experience'}</h2></div></div><MarkdownContent>{sectionBody(section)}</MarkdownContent></section>;
  return <section className="section prose-section" id={section.id}><div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div></div><MarkdownContent>{sectionBody(section)}</MarkdownContent></section>;
}

export function Portfolio({ document }: { document: PortfolioDocument }) {
  return <><header className="site-header"><a href="#intro" className="wordmark">NK<span>.</span></a><nav aria-label="Main navigation"><a href="#featured-projects">WORK</a><a href="#skills">TOOLKIT</a><a href="#contact">CONTACT</a></nav><a className="availability" href="mailto:nishchaykumar89@gmail.com"><i /> OPEN TO OPPORTUNITIES</a></header>
    <main>{document.blocks.map((block) => <Section key={block.id} section={block} />)}</main>
    <footer className="site-footer"><a href="#intro" className="wordmark">NK<span>.</span></a><span>DESIGNED & BUILT WITH INTENTION</span><span>© {new Date().getFullYear()} NISHCHAY KUMAR</span></footer></>;
}
