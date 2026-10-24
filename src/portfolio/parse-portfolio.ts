import type { PortfolioDocument, PortfolioItem, PortfolioSection, PortfolioSectionType } from './portfolio-types';

const sectionStart = /^\s*<!--\s*portfolio:section\s+(.+?)\s*-->\s*$/;
const itemStart = /^\s*<!--\s*portfolio:item\s+(.+?)\s*-->\s*$/;
const knownSections = new Set<PortfolioSectionType>(['markdown', 'hero', 'project-grid', 'skills', 'experience', 'github-activity', 'contact']);

function metadata(raw: string, line: number): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error('metadata must be a JSON object');
    return parsed as Record<string, unknown>;
  } catch (error) {
    throw new Error(`Line ${line}: invalid marker JSON (${error instanceof Error ? error.message : 'parse error'}).`);
  }
}

export function parsePortfolio(source: string): PortfolioDocument {
  const blocks: PortfolioSection[] = [];
  const ids = new Set<string>();
  let section: PortfolioSection | null = null;
  let item: PortfolioItem | null = null;
  let buffer: string[] = [];
  let mode: 'outside' | 'section' | 'item' = 'outside';
  const flush = () => {
    const value = buffer.join('\n').trim();
    if (mode === 'outside' && value) blocks.push({ id: `markdown-${blocks.length + 1}`, type: 'markdown', metadata: {}, markdown: value, items: [], line: 1 });
    if (mode === 'section' && section) section.markdown += (section.markdown ? '\n\n' : '') + value;
    if (mode === 'item' && item) item.markdown += (item.markdown ? '\n\n' : '') + value;
    buffer = [];
  };

  for (const [index, line] of source.split(/\r?\n/).entries()) {
    const lineNo = index + 1;
    const sec = line.match(sectionStart);
    const itm = line.match(itemStart);
    if (sec) {
      if (mode !== 'outside') throw new Error(`Line ${lineNo}: section cannot start inside another block.`);
      flush();
      const meta = metadata(sec[1], lineNo);
      const id = meta.id;
      const type = meta.type;
      if (typeof id !== 'string' || !id.trim()) throw new Error(`Line ${lineNo}: section requires a non-empty id.`);
      if (typeof type !== 'string' || !knownSections.has(type as PortfolioSectionType)) throw new Error(`Line ${lineNo}: unsupported section type "${String(type)}".`);
      if (ids.has(id)) throw new Error(`Line ${lineNo}: duplicate id "${id}".`);
      ids.add(id);
      section = { id, type: type as PortfolioSectionType, metadata: meta, markdown: '', items: [], line: lineNo };
      blocks.push(section); mode = 'section'; continue;
    }
    if (itm) {
      if (mode !== 'section' || !section || section.type !== 'project-grid') throw new Error(`Line ${lineNo}: project items must be inside a project-grid section.`);
      flush();
      const meta = metadata(itm[1], lineNo);
      const id = meta.id;
      if (typeof id !== 'string' || !id.trim()) throw new Error(`Line ${lineNo}: item requires a non-empty id.`);
      if (meta.type !== 'project') throw new Error(`Line ${lineNo}: unsupported item type "${String(meta.type)}".`);
      if (ids.has(id)) throw new Error(`Line ${lineNo}: duplicate id "${id}".`);
      ids.add(id);
      item = { id, type: 'project', metadata: meta, markdown: '', line: lineNo };
      section.items.push(item); mode = 'item'; continue;
    }
    if (/^\s*<!--\s*portfolio:enditem\s*-->\s*$/.test(line)) {
      if (mode !== 'item' || !item) throw new Error(`Line ${lineNo}: enditem without an open item.`);
      flush(); item = null; mode = 'section'; continue;
    }
    if (/^\s*<!--\s*portfolio:endsection\s*-->\s*$/.test(line)) {
      if (mode !== 'section' || !section) throw new Error(`Line ${lineNo}: endsection without an open section.`);
      flush(); section = null; mode = 'outside'; continue;
    }
    if (/portfolio:(?:section|item|endsection|enditem)/.test(line)) throw new Error(`Line ${lineNo}: malformed or unsupported portfolio marker.`);
    buffer.push(line);
  }
  if (mode === 'item') throw new Error(`Line ${source.split(/\r?\n/).length}: item "${item?.id}" is not closed.`);
  if (mode === 'section') throw new Error(`Line ${source.split(/\r?\n/).length}: section "${section?.id}" is not closed.`);
  flush();
  return { blocks };
}
