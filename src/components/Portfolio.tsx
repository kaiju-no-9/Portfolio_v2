import { useState } from 'react';
import type { PortfolioDocument, PortfolioItem, PortfolioSection } from '../portfolio/portfolio-types';
import { GitHubContributions } from './GitHubContributions';
import { MarkdownContent } from './MarkdownContent';

function heading(markdown: string, level: number): string {
  return markdown.match(new RegExp(`^\\s*#{${level}}\\s+(.+)$`, 'm'))?.[1]?.trim() ?? '';
}

function withoutHeading(markdown: string): string {
  return markdown.replace(/^\s*#{1,6}\s+[^\n]+\n*/, '').trim();
}

function projectSummary(item: PortfolioItem): string {
  return withoutHeading(item.markdown).split(/\n\s*\n/)[0]?.trim() ?? '';
}

function ProjectRow({ item }: { item: PortfolioItem }) {
  const name = heading(item.markdown, 3) || item.id;
  const category = typeof item.metadata.category === 'string' ? item.metadata.category : '';
  const tagline = typeof item.metadata.tagline === 'string' ? item.metadata.tagline : '';
  const repo = typeof item.metadata.repo === 'string' ? item.metadata.repo : undefined;
  const demo = typeof item.metadata.demo === 'string' ? item.metadata.demo : undefined;
  const packageUrl = typeof item.metadata.package === 'string' ? item.metadata.package : undefined;
  return <article className="project-row">
    <div className="project-title-line">
      <h3>{repo ? <a href={repo} target="_blank" rel="noreferrer">{name}</a> : name}{tagline && <span className="project-tagline"> // {tagline}</span>}</h3>
      {category && <p className="project-stack">{category}</p>}
    </div>
    <div className="project-detail-line">
      <MarkdownContent className="project-summary">{projectSummary(item)}</MarkdownContent>
      <div className="project-outbound-links">
        {packageUrl && <a className="row-link" href={packageUrl} target="_blank" rel="noreferrer">npm ↗</a>}
        {demo && <a className="row-link" href={demo} target="_blank" rel="noreferrer">demo ↗</a>}
      </div>
    </div>
  </article>;
}

function SectionLabel({ children, href }: { children: string; href?: string }) {
  const external = href?.startsWith('https://');
  return <div className="section-label"><h2>{children}</h2>{href && <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>see all →</a>}</div>;
}

const projectCategories = ['All', 'AI', 'Product', 'Backend', 'Systems'];

function projectCategory(item: PortfolioItem): string {
  const category = typeof item.metadata.category === 'string' ? item.metadata.category : '';
  return category.split('·')[0]?.trim() || 'Other';
}

function ProjectsPage({ sections }: { sections: PortfolioSection[] }) {
  const [category, setCategory] = useState('All');
  const items = sections.flatMap((section) => section.items);
  const uniqueItems = [...new Map(items.map((item) => [item.id, item])).values()];
  const visibleItems = category === 'All' ? uniqueItems : uniqueItems.filter((item) => projectCategory(item).toLowerCase() === category.toLowerCase());

  return <section className="content-section" id="all-projects">
    <div className="project-filters" role="group" aria-label="Filter projects by category">
      {projectCategories.map((filter) => <button key={filter} type="button" aria-pressed={category === filter} onClick={() => setCategory(filter)}>{filter}</button>)}
    </div>
    <div className="project-list">{visibleItems.map((item) => <ProjectRow key={item.id} item={item} />)}</div>
  </section>;
}

function Skills({ section }: { section: PortfolioSection }) {
  const badgeTones: Record<string, string> = {
    'agent harnesses': 'indigo',
    'reliable multi-step workflows': 'purple',
    RAG: 'violet',
    'evaluation systems': 'violet',
    'full-stack applications': 'blue',
    'AI pipelines': 'violet',
    'developer tools': 'teal',
    APIs: 'teal',
    databases: 'blue',
    'distributed systems': 'indigo',
    'open source': 'amber',
  };
  const groups = withoutHeading(section.markdown).split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\s*-\s+\*\*(.+?)(?::\*\*|\*\*:)\s*(.+)$/);
    if (!match) return [];
    const topics = match[2].split(/,\s*|\s+and\s+/i).map((topic) => topic.replace(/^and\s+/i, '').trim()).filter(Boolean);
    return [{ label: match[1].trim(), topics }];
  });

  return <section className="content-section" id={section.id}>
    <SectionLabel>{String(section.metadata.title ?? 'toolkit').toLowerCase()}</SectionLabel>
    <div className="skills-list">
      {groups.map((group) => <div className="skills-group" key={group.label}>
        <h3 className="skills-group-heading"><samp><b>› {group.label.toUpperCase()}</b></samp></h3>
        <ul className="skills-badges" aria-label={group.label}>
          {group.topics.map((topic) => <li key={topic} data-tone={badgeTones[topic] ?? 'blue'}>{topic}</li>)}
        </ul>
      </div>)}
    </div>
  </section>;
}

function githubProfile(markdown: string): { username: string; profileUrl: string; avatarUrl: string } | undefined {
  const match = markdown.match(/\[[^\]]*github[^\]]*\]\((https:\/\/github\.com\/([^/)]+))\/?\)/i);
  if (!match) return undefined;
  return { username: match[2], profileUrl: match[1], avatarUrl: `${match[1]}.png?size=160` };
}

function ContactLinks({ markdown }: { markdown: string }) {
  const links = [...markdown.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+|mailto:[^)]+)\)/g)];
  return <nav className="social-links" aria-label="Contact and social links">
    {links.map(([, label, url]) => <a key={url} href={url} target={url.startsWith('mailto:') ? undefined : '_blank'} rel={url.startsWith('mailto:') ? undefined : 'noreferrer'}>{label.toLowerCase()}</a>)}
  </nav>;
}

function PortfolioSection({ section, page }: { section: PortfolioSection; page: 'home' | 'projects' }) {
  if (section.type === 'project-grid') return <section className="content-section" id={section.id}>
    <SectionLabel href={page === 'home' ? '/projects/' : undefined}>{String(section.metadata.title ?? 'projects').toLowerCase()}</SectionLabel>
    <div className="project-list">{section.items.filter((item) => page === 'projects' || item.metadata.featured === true).map((item) => <ProjectRow key={item.id} item={item} />)}</div>
  </section>;
  if (section.type === 'skills') return <Skills section={section} />;
  if (section.type === 'markdown' || section.type === 'experience') return <section className="content-section prose-section" id={section.id}>
    {typeof section.metadata.title === 'string' && <SectionLabel>{section.metadata.title.toLowerCase()}</SectionLabel>}
    <MarkdownContent>{withoutHeading(section.markdown)}</MarkdownContent>
  </section>;
  return null;
}

export function Portfolio({ document, page = 'home' }: { document: PortfolioDocument; page?: 'home' | 'projects' }) {
  const hero = document.blocks.find((block) => block.type === 'hero');
  const subtitle = typeof hero?.metadata.subtitle === 'string' ? hero.metadata.subtitle : undefined;
  const sections = document.blocks.filter((block) => {
    if (block.type === 'hero' || block.type === 'contact') return false;
    if (page === 'projects') return block.type === 'project-grid';
    return block.id !== 'more-projects';
  });
  const heroContent = hero ? withoutHeading(hero.markdown) : '';
  const heroParts = heroContent.split(/\n\s*\n/);
  const intro = heroParts.filter((part) => !/\[[^\]]+\]\([^)]+\)/.test(part)).join('\n\n') || heroContent;
  const contactContent = heroParts.filter((part) => /\[[^\]]+\]\([^)]+\)/.test(part)).join('\n\n');
  const github = githubProfile(contactContent);

  return <div className="page-shell">
    <header className="site-header">
      <nav aria-label="Main navigation">
        <a href="/#intro" aria-current={page === 'home' ? 'page' : undefined}>home</a>
        <a href="/projects/" aria-current={page === 'projects' ? 'page' : undefined}>projects</a>
        <a href="/#skills">toolkit</a>
      </nav>
      {github && <a className="profile-avatar-link header-avatar" href={github.profileUrl} target="_blank" rel="noreferrer" aria-label="View Nishchay Kumar's GitHub profile">
        <img className="profile-avatar" src={github.avatarUrl} alt="" width="36" height="36" />
      </a>}
    </header>
    <main>
      {page === 'home' ? <>
        <section className="intro" id="intro">
          <div className="intro-heading">
            <h1>{hero ? heading(hero.markdown, 1) : 'Portfolio'}</h1>
          </div>
          {subtitle && <p className="intro-meta">{subtitle}</p>}
          <MarkdownContent className="intro-copy">{intro}</MarkdownContent>
        </section>
        {github && <GitHubContributions username={github.username} profileUrl={github.profileUrl} />}
      </> : <section className="intro projects-intro"><a className="back-link" href="/#intro">← home</a><h1>Projects</h1><p className="intro-meta">AI &amp; agents · full-stack products · systems &amp; infrastructure</p></section>}
      {page === 'projects'
        ? <ProjectsPage sections={sections.filter((section) => section.type === 'project-grid')} />
        : sections.map((section) => <PortfolioSection section={section} page={page} key={section.id} />)}
    </main>
    <footer className="site-footer"><ContactLinks markdown={contactContent} /><span>© {new Date().getFullYear()} Nishchay Kumar</span></footer>
  </div>;
}
