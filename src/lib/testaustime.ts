const BASE = 'https://api.testaustime.fi/users/trimpsuz/activity';

export type TestaustimePeriod = {
  languages: Record<string, number>;
  total: number;
};

export type TestaustimeSummary = {
  all_time: TestaustimePeriod;
  last_month: TestaustimePeriod;
  last_week: TestaustimePeriod;
};

export type TestaustimeCurrent = {
  started: string;
  duration: number;
  heartbeat: {
    project_name: string;
    language: string;
    editor_name: string;
    hostname?: string;
  };
};

export async function getSummary() {
  const res = await fetch(`${BASE}/summary`);
  if (!res.ok) throw new Error('Failed to load Testaustime summary');
  return res.json() as Promise<TestaustimeSummary>;
}

export async function getCurrent() {
  const res = await fetch(`${BASE}/current`);
  if (!res.ok) return null;
  return res.json() as Promise<TestaustimeCurrent | null>;
}

export const LANGUAGE_NAMES: Record<string, string> = {
  '': 'Unknown',
  none: 'Plain Text',
  plaintext: 'Plain Text',
  GLSL: 'OpenGL Shading Language',
  'Google Sheets': 'Google Sheets',
  Groovy: 'Groovy',
  groovy: 'Groovy',
  JSON: 'JSON',
  json: 'JSON',
  jsonc: 'JSON with Comments',
  Java: 'Java',
  Kotlin: 'Kotlin',
  Log: 'Log',
  Markdown: 'Markdown',
  markdown: 'Markdown',
  Properties: 'Properties',
  properties: 'Properties',
  Scratch: 'Scratch',
  astro: 'Astro',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  css: 'CSS',
  dockercompose: 'Docker Compose',
  dockerfile: 'Dockerfile',
  dotenv: '.env',
  go: 'Go',
  html: 'HTML',
  ignore: 'Ignore File',
  ini: 'INI',
  javascript: 'JavaScript',
  javascriptreact: 'JavaScript (React)',
  makefile: 'Makefile',
  php: 'PHP',
  postcss: 'PostCSS',
  powershell: 'PowerShell',
  prisma: 'Prisma',
  python: 'Python',
  r: 'R',
  rust: 'Rust',
  shellscript: 'Shell Script',
  sql: 'SQL',
  toml: 'TOML',
  typescript: 'TypeScript',
  typescriptreact: 'TypeScript (React)',
  vue: 'Vue',
  xml: 'XML',
  yaml: 'YAML',
};

export function getLanguageName(languageId: string): string {
  return LANGUAGE_NAMES[languageId] ?? languageId;
}

export function groupLanguagesByPrettyName(languages: Record<string, number>): Array<[string, number]> {
  const grouped = new Map<string, number>();

  for (const [languageId, seconds] of Object.entries(languages)) {
    const prettyName = getLanguageName(languageId);
    grouped.set(prettyName, (grouped.get(prettyName) ?? 0) + seconds);
  }

  return Array.from(grouped.entries());
}
