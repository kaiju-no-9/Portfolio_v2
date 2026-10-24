import { Fragment, useEffect, useMemo, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionsResponse {
  contributions?: ContributionDay[];
}

interface CachedContributions {
  cachedAt: number;
  days: ContributionDay[];
}

interface ContributionTooltip {
  date: string;
  text: string;
  left: number;
  top: number;
}

type Week = Array<ContributionDay | undefined>;

const API_URL = 'https://github-contributions-api.jogruber.de/v4';
const CACHE_TTL = 24 * 60 * 60 * 1000;
const BLOCK_SIZE = 11;
const BLOCK_MARGIN = 3;
const BLOCK_RADIUS = 2;
const FONT_SIZE = 14;
const LABEL_HEIGHT = FONT_SIZE + 8;

function isContributionDay(value: unknown): value is ContributionDay {
  if (!value || typeof value !== 'object') return false;
  const day = value as Partial<ContributionDay>;
  return typeof day.date === 'string' && typeof day.count === 'number' && typeof day.level === 'number';
}

function normalizeResponse(value: unknown): Omit<CachedContributions, 'cachedAt'> {
  const response = value as ContributionsResponse;
  if (!response || !Array.isArray(response.contributions)) throw new Error('Invalid contribution response');
  const days = response.contributions.filter(isContributionDay).map((day) => ({
    date: day.date,
    count: Math.max(0, day.count),
    level: Math.min(4, Math.max(0, day.level)),
  }));
  if (!days.length) throw new Error('No contribution data returned');
  return { days };
}

function readCache(key: string): CachedContributions | undefined {
  try {
    const cached = JSON.parse(localStorage.getItem(key) ?? 'null') as CachedContributions | null;
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL && Array.isArray(cached.days)) return cached;
  } catch {
    // Ignore unavailable or malformed browser storage and fetch fresh data.
  }
  return undefined;
}

function writeCache(key: string, data: Omit<CachedContributions, 'cachedAt'>) {
  try {
    localStorage.setItem(key, JSON.stringify({ ...data, cachedAt: Date.now() }));
  } catch {
    // The graph still works when storage is disabled.
  }
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fillHoles(days: ContributionDay[]): ContributionDay[] {
  if (!days.length) return [];
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map((day) => [day.date, day]));
  const current = parseDate(sorted[0].date);
  const end = parseDate(sorted[sorted.length - 1].date);
  const filled: ContributionDay[] = [];

  while (current <= end) {
    const date = isoDate(current);
    filled.push(byDate.get(date) ?? { date, count: 0, level: 0 });
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return filled;
}

function groupByWeeks(days: ContributionDay[]): Week[] {
  const normalized = fillHoles(days);
  if (!normalized.length) return [];
  const leadingEmptyDays = parseDate(normalized[0].date).getUTCDay();
  const padded: Array<ContributionDay | undefined> = [
    ...Array<ContributionDay | undefined>(leadingEmptyDays).fill(undefined),
    ...normalized,
  ];
  return Array.from({ length: Math.ceil(padded.length / 7) }, (_, index) => padded.slice(index * 7, index * 7 + 7));
}

function getMonthLabels(weeks: Week[]) {
  const labels = weeks.reduce<Array<{ weekIndex: number; label: string }>>((result, week, weekIndex) => {
    const firstDay = week.find((day): day is ContributionDay => day !== undefined);
    if (!firstDay) return result;
    const label = parseDate(firstDay.date).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    if (weekIndex === 0 || result.at(-1)?.label !== label) result.push({ weekIndex, label });
    return result;
  }, []);

  return labels.filter(({ weekIndex }, index) => {
    const minWeeks = 3;
    if (index === 0) return Boolean(labels[1] && labels[1].weekIndex - weekIndex >= minWeeks);
    if (index === labels.length - 1) return weeks.slice(weekIndex).length >= minWeeks;
    return true;
  });
}

function tooltipDate(date: string) {
  const value = parseDate(date);
  return [value.getUTCDate(), value.getUTCMonth() + 1, value.getUTCFullYear()]
    .map((part, index) => index < 2 ? String(part).padStart(2, '0') : String(part))
    .join('.');
}

function GitHubContributionsFallback() {
  return <div className="contributions-fallback" role="status" aria-label="Loading GitHub contributions">
    <span className="contributions-spinner" />
  </div>;
}

export function GitHubContributions({ username, profileUrl }: { username: string; profileUrl: string }) {
  const cacheKey = `github-contributions:${username}:last-year`;
  const [activity, setActivity] = useState<CachedContributions>();
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState<ContributionTooltip>();

  useEffect(() => {
    const cached = readCache(cacheKey);
    if (cached) {
      setActivity(cached);
      return;
    }

    const controller = new AbortController();
    fetch(`${API_URL}/${encodeURIComponent(username)}?y=last`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Contribution request failed with ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then(normalizeResponse)
      .then((data) => {
        writeCache(cacheKey, data);
        setActivity({ ...data, cachedAt: Date.now() });
      })
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === 'AbortError')) setError(true);
      });

    return () => controller.abort();
  }, [cacheKey, username]);

  const weeks = useMemo(() => groupByWeeks(activity?.days ?? []), [activity]);
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);
  const width = weeks.length * (BLOCK_SIZE + BLOCK_MARGIN) - BLOCK_MARGIN;
  const height = LABEL_HEIGHT + (BLOCK_SIZE + BLOCK_MARGIN) * 7 - BLOCK_MARGIN;
  const totalCount = activity?.days.reduce((sum, day) => sum + day.count, 0) ?? 0;
  const year = activity?.days.length ? parseDate(activity.days[0].date).getUTCFullYear() : new Date().getFullYear();

  function showTooltip(element: SVGGraphicsElement, day: ContributionDay) {
    const bounds = element.getBoundingClientRect();
    setTooltip({
      date: day.date,
      text: `${day.count} contribution${day.count > 1 ? 's' : ''} on ${tooltipDate(day.date)}`,
      left: bounds.left + bounds.width / 2,
      top: bounds.top - 8,
    });
  }

  if (error) return <section className="content-section contributions-error" aria-label="GitHub contributions">
    Contribution activity is temporarily unavailable. Visit <a href={profileUrl} target="_blank" rel="noopener">GitHub</a>.
  </section>;

  if (!activity) return <section className="content-section"><GitHubContributionsFallback /></section>;

  return <section className="content-section github-contributions" aria-label="GitHub contributions">
    <div className="contribution-graph">
      <div className="contribution-calendar" tabIndex={0} aria-label="Scrollable GitHub contribution calendar">
        <div className="contribution-calendar-inset">
          <svg className="contribution-svg" height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
            <title>GitHub Contributions</title>
            <g className="contribution-month-labels" aria-hidden="true">
              {monthLabels.map(({ label, weekIndex }) => <text dominantBaseline="hanging" x={(BLOCK_SIZE + BLOCK_MARGIN) * weekIndex} key={weekIndex}>{label}</text>)}
            </g>
            {weeks.map((week, weekIndex) => week.map((day, dayIndex) => day && <Fragment key={`${weekIndex}-${dayIndex}`}>
              <g
                className="contribution-day"
                role="gridcell"
                tabIndex={0}
                aria-label={`${day.count} contribution${day.count > 1 ? 's' : ''} on ${tooltipDate(day.date)}`}
                aria-describedby={tooltip?.date === day.date ? 'contribution-tooltip' : undefined}
                onMouseEnter={(event) => showTooltip(event.currentTarget, day)}
                onMouseLeave={() => setTooltip(undefined)}
                onFocus={(event) => showTooltip(event.currentTarget, day)}
                onBlur={() => setTooltip(undefined)}
              >
                <rect
                  className="contribution-block"
                  data-count={day.count}
                  data-date={day.date}
                  data-level={day.level}
                  height={BLOCK_SIZE}
                  rx={BLOCK_RADIUS}
                  ry={BLOCK_RADIUS}
                  width={BLOCK_SIZE}
                  x={(BLOCK_SIZE + BLOCK_MARGIN) * weekIndex}
                  y={LABEL_HEIGHT + (BLOCK_SIZE + BLOCK_MARGIN) * dayIndex}
                />
              </g>
            </Fragment>))}
          </svg>
        </div>
      </div>
      <div className="contribution-footer">
        <div className="contribution-total">
          {totalCount.toLocaleString('en')} contributions in {year} on <a href={profileUrl} target="_blank" rel="noopener">GitHub</a>.
        </div>
        <div className="contribution-legend" aria-label="Contribution intensity: less to more">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => <svg height={BLOCK_SIZE} width={BLOCK_SIZE} key={level} aria-hidden="true"><rect className="contribution-block" data-level={level} height={BLOCK_SIZE} rx={BLOCK_RADIUS} ry={BLOCK_RADIUS} width={BLOCK_SIZE} /></svg>)}
          <span>More</span>
        </div>
      </div>
    </div>
    {tooltip && <div className="contribution-tooltip" id="contribution-tooltip" role="tooltip" style={{ left: tooltip.left, top: tooltip.top }}>{tooltip.text}</div>}
  </section>;
}
