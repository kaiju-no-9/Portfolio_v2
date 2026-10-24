import { mkdir, writeFile } from 'node:fs/promises';

const token = process.env.GITHUB_TOKEN;
const login = process.env.GITHUB_USERNAME ?? 'kaiju-no-9';
if (!token) throw new Error('Set GITHUB_TOKEN in the server or CI environment before generating activity data.');

const query = `query($login: String!, $from: DateTime!, $to: DateTime!) { user(login: $login) { contributionsCollection(from: $from, to: $to) { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
const to = new Date();
const from = new Date(to);
from.setUTCFullYear(from.getUTCFullYear() - 1);
const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { login, from: from.toISOString(), to: to.toISOString() } }),
});
if (!response.ok) throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText}`);
const result: unknown = await response.json();
if (!result || typeof result !== 'object' || !('data' in result)) throw new Error('GitHub returned an invalid response.');
const payload = result as { data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions?: number; weeks?: Array<{ contributionDays?: Array<{ date: string; contributionCount: number; contributionLevel: string }> }> } } } }; errors?: Array<{ message?: string }> };
if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message ?? 'GraphQL error').join('; '));
const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
if (!calendar || !Array.isArray(calendar.weeks)) throw new Error(`No contribution calendar returned for ${login}.`);
const levels: Record<string, number> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const snapshot = {
  username: login,
  generatedAt: new Date().toISOString(),
  totalContributions: calendar.totalContributions ?? 0,
  weeks: calendar.weeks.map((week) => (week.contributionDays ?? []).map((day) => ({ date: day.date, count: day.contributionCount, level: levels[day.contributionLevel] ?? 0 }))),
};
const output = new URL('../public/data/github-activity.json', import.meta.url);
await mkdir(new URL('../public/data/', import.meta.url), { recursive: true });
await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote contribution snapshot for ${login} to public/data/github-activity.json.`);
