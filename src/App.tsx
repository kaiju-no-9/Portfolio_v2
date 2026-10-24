import portfolioSource from '../content/portfolio.md?raw';
import { Portfolio } from './components/Portfolio';
import { parsePortfolio } from './portfolio/parse-portfolio';
import { validatePortfolio } from './portfolio/validate-portfolio';

const document = parsePortfolio(portfolioSource);
validatePortfolio(document);

export default function App() {
  const page = window.location.pathname.replace(/\/+$/, '') === '/projects' ? 'projects' : 'home';
  return <Portfolio document={document} page={page} />;
}
