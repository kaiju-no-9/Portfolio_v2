export type PortfolioSectionType = 'markdown' | 'hero' | 'project-grid' | 'skills' | 'experience' | 'github-activity' | 'contact';
export interface PortfolioItem { id: string; type: 'project'; metadata: Record<string, unknown>; markdown: string; line: number }
export interface PortfolioSection { id: string; type: PortfolioSectionType; metadata: Record<string, unknown>; markdown: string; items: PortfolioItem[]; line: number }
export interface PortfolioDocument { blocks: PortfolioSection[] }
