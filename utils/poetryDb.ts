import { Poem } from '@/types';
import { getCountryByCode } from '@/mocks/countries';

type PoetryDbPoem = {
  title?: string;
  author?: string;
  lines?: string[];
  linecount?: string;
};

const POETRY_DB_BASE_URL = 'https://poetrydb.org';

const COUNTRY_AUTHOR_MAP: Record<string, string[]> = {
  US: [
    'Emily Dickinson',
    'Robert Frost',
    'Walt Whitman',
    'Edgar Allan Poe',
    'Langston Hughes',
    'William Carlos Williams',
  ],
  GB: [
    'William Shakespeare',
    'William Wordsworth',
    'Samuel Taylor Coleridge',
    'John Keats',
    'Lord Byron',
    'Percy Bysshe Shelley',
  ],
  IE: ['W. B. Yeats', 'Oscar Wilde'],
  FR: ['Charles Baudelaire', 'Paul Verlaine'],
};

function slugifyId(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function normalizePoemText(lines?: string[]): string {
  if (!lines || lines.length === 0) return '';
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function isLikelyPublicDomain(author?: string): boolean {
  const a = (author ?? '').toLowerCase();
  if (!a) return false;

  const allowList = [
    'emily dickinson',
    'robert frost',
    'walt whitman',
    'edgar allan poe',
    'langston hughes',
    'william shakespeare',
    'william wordsworth',
    'samuel taylor coleridge',
    'john keats',
    'lord byron',
    'percy bysshe shelley',
    'oscar wilde',
    'w. b. yeats',
  ];

  return allowList.some((x) => a.includes(x));
}

async function fetchPoetryDbByAuthor(author: string): Promise<PoetryDbPoem[]> {
  const authorParam = encodeURIComponent(author);
  const url = `${POETRY_DB_BASE_URL}/author/${authorParam}/title,author,lines,linecount`;

  console.log('[PoetryDB] Fetch:', url);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.log('[PoetryDB] Non-OK response:', res.status, text.slice(0, 200));
    throw new Error(`PoetryDB request failed (${res.status})`);
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    console.log('[PoetryDB] Unexpected response shape:', typeof data);
    return [];
  }

  return data as PoetryDbPoem[];
}

export async function fetchCountryPoemsFromPoetryDb(params: {
  countryCode: string;
  limit?: number;
}): Promise<Poem[]> {
  const { countryCode, limit = 80 } = params;

  const authors = COUNTRY_AUTHOR_MAP[countryCode] ?? [];
  if (authors.length === 0) {
    console.log('[PoetryDB] No authors mapped for country:', countryCode);
    return [];
  }

  const country = getCountryByCode(countryCode);

  const poems: Poem[] = [];
  const seen = new Set<string>();

  for (const author of authors) {
    let items: PoetryDbPoem[] = [];

    try {
      items = await fetchPoetryDbByAuthor(author);
    } catch (e) {
      console.error('[PoetryDB] Failed author fetch:', author, e);
      continue;
    }

    for (const item of items) {
      if (poems.length >= limit) break;

      if (!isLikelyPublicDomain(item.author)) continue;

      const title = (item.title ?? '').trim();
      const text = normalizePoemText(item.lines);
      if (!title || !text) continue;

      const id = `poetrydb-${countryCode.toLowerCase()}-${slugifyId(`${item.author ?? 'unknown'}-${title}`)}`;
      if (seen.has(id)) continue;
      seen.add(id);

      const poetName = (item.author ?? author).trim();

      poems.push({
        id,
        title,
        text,
        poetId: `poetrydb-${slugifyId(poetName)}`,
        poet: {
          id: `poetrydb-${slugifyId(poetName)}`,
          name: poetName,
          country: country?.name ?? countryCode,
          countryCode,
        },
        originalLanguage: 'English',
        moods: ['reflection'],
        country: country?.name ?? countryCode,
        countryCode,
        lineCount: text.split('\n').filter((l) => l.trim()).length,
        culturalContext: undefined,
        translatedText: undefined,
        audioUrl: undefined,
        isPremium: false,
      });
    }

    if (poems.length >= limit) break;
  }

  console.log('[PoetryDB] Fetched poems:', poems.length, 'for', countryCode);
  return poems;
}
