import { readFile } from 'node:fs/promises';
import { parsePortfolio } from '../src/portfolio/parse-portfolio.ts';
import { validatePortfolio } from '../src/portfolio/validate-portfolio.ts';

const source = await readFile(new URL('../content/portfolio.md', import.meta.url), 'utf8');
const document = parsePortfolio(source);
validatePortfolio(document);
console.log(`Portfolio content is valid (${document.blocks.length} sections).`);
