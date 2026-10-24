import type { PortfolioDocument } from './portfolio-types';

const validUrl = (value: unknown, field: string, line: number, allowMailto = false) => {
  if (value === undefined && allowMailto) return;
  if (typeof value !== 'string') throw new Error(`Line ${line}: ${field} must be a URL.`);
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && !(allowMailto && url.protocol === 'mailto:')) throw new Error();
  } catch { throw new Error(`Line ${line}: ${field} must use https${allowMailto ? ' or mailto' : ''}.`); }
};

export function validatePortfolio(document: PortfolioDocument): void {
  const hero = document.blocks.filter((block) => block.type === 'hero');
  if (hero.length !== 1) throw new Error(`Expected exactly one hero section; found ${hero.length}.`);
  for (const block of document.blocks) {
    if (block.type === 'hero' && !/^\s*#\s+\S/m.test(block.markdown)) throw new Error(`Line ${block.line}: hero needs one primary Markdown heading.`);
    if (block.type === 'project-grid') {
      if (!block.items.length) throw new Error(`Line ${block.line}: project-grid needs at least one project.`);
      for (const item of block.items) {
        const title = item.markdown.match(/^\s*###\s+(.+)/m)?.[1];
        const stack = item.metadata.stack;
        if (!title) throw new Error(`Line ${item.line}: project "${item.id}" needs a ### title.`);
        if (!Array.isArray(stack) || !stack.length || !stack.every((entry) => typeof entry === 'string')) throw new Error(`Line ${item.line}: project "${item.id}" needs a non-empty stack array.`);
        validUrl(item.metadata.repo, 'repo', item.line);
        if (item.metadata.demo !== undefined) validUrl(item.metadata.demo, 'demo', item.line);
        if (item.metadata.image !== undefined) validUrl(item.metadata.image, 'image', item.line);
      }
    }
    if (block.type === 'github-activity' && (typeof block.metadata.username !== 'string' || !block.metadata.username.trim())) throw new Error(`Line ${block.line}: github-activity needs a username.`);
  }
}
