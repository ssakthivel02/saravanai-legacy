const GDELT_ENDPOINT = 'https://api.gdeltproject.org/api/v2/doc/doc';

function stripHtml(value = '') {
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTamil(value = '') {
  return /[\u0B80-\u0BFF]/.test(value);
}

async function fetchJson(fetcher, url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(url, {
      headers: { 'User-Agent': 'SakthiAI/0.3.1 (+https://sakthiai.omsaravanabhava.org)' },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function searchGdelt(query, fetcher) {
  const url = new URL(GDELT_ENDPOINT);
  url.searchParams.set('query', query);
  url.searchParams.set('mode', 'ArtList');
  url.searchParams.set('format', 'json');
  url.searchParams.set('maxrecords', '8');
  url.searchParams.set('sort', 'DateDesc');

  const payload = await fetchJson(fetcher, url);
  return (payload.articles || [])
    .filter((item) => item?.url && item?.title)
    .map((item) => ({
      title: stripHtml(item.title),
      url: item.url,
      snippet: [item.domain, item.seendate, item.sourcecountry].filter(Boolean).join(' · '),
      sourceType: 'news-index',
      publishedAt: item.seendate || null
    }));
}

async function searchWikipedia(query, language = 'en', fetcher) {
  const host = language === 'ta' ? 'ta.wikipedia.org' : 'en.wikipedia.org';
  const url = new URL(`https://${host}/w/api.php`);
  url.searchParams.set('action', 'query');
  url.searchParams.set('list', 'search');
  url.searchParams.set('srsearch', query);
  url.searchParams.set('srlimit', '5');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');

  const payload = await fetchJson(fetcher, url);
  return (payload?.query?.search || []).map((item) => ({
    title: stripHtml(item.title),
    url: `https://${host}/wiki/${encodeURIComponent(String(item.title).replaceAll(' ', '_'))}`,
    snippet: stripHtml(item.snippet),
    sourceType: 'encyclopaedia',
    publishedAt: item.timestamp || null
  }));
}

function deduplicate(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function sourceContext(sources) {
  return sources.map((source, index) => [
    `[${index + 1}] ${source.title}`,
    `URL: ${source.url}`,
    source.publishedAt ? `Observed/published: ${source.publishedAt}` : '',
    source.snippet ? `Metadata/snippet: ${source.snippet}` : ''
  ].filter(Boolean).join('\n')).join('\n\n');
}

export async function runFreeResearch(prompt, env, options = {}) {
  const failures = [];
  const results = [];
  const fetcher = options.fetcher || fetch;

  try {
    results.push(...await searchGdelt(prompt, fetcher));
  } catch (error) {
    failures.push({ connector: 'gdelt', error: error?.message || 'GDELT failed' });
  }

  try {
    results.push(...await searchWikipedia(prompt, isTamil(prompt) ? 'ta' : 'en', fetcher));
  } catch (error) {
    failures.push({ connector: 'wikipedia', error: error?.message || 'Wikipedia failed' });
  }

  const sources = deduplicate(results).slice(0, 10);
  if (!sources.length) throw new Error(`Free research connectors returned no sources: ${JSON.stringify(failures)}`);
  if (!env.AI) throw new Error('Workers AI binding is unavailable for source synthesis.');

  const checkedAt = new Date().toISOString();
  const model = options.model || env.EDGE_MODEL || '@cf/meta/llama-3.1-8b-instruct-fast';
  const messages = [
    {
      role: 'system',
      content: [
        'You are SakthiAI research synthesis.',
        'Use only the supplied source metadata and snippets.',
        'Do not add facts from model memory.',
        'Cite claims with bracket numbers such as [1].',
        'Clearly state when the sources are insufficient, indirect, non-official or contradictory.',
        'Respond in the language used by the user.'
      ].join(' ')
    },
    {
      role: 'user',
      content: `Checked at ${checkedAt}.\n\nQuestion:\n${prompt}\n\nRetrieved sources:\n${sourceContext(sources)}`
    }
  ];

  const result = await env.AI.run(model, {
    messages,
    max_tokens: 2200,
    temperature: 0.15
  }, options.gatewayOptions || undefined);

  const answer = typeof result === 'string' ? result : result?.response;
  if (!answer) throw new Error('Workers AI returned an empty research synthesis.');

  return {
    answer,
    citations: sources.map((source, index) => ({ ...source, index: index + 1 })),
    searchedAt: checkedAt,
    model,
    provider: 'free-research',
    costClass: 'free-first',
    connectorFailures: failures,
    limitations: [
      'Free research uses GDELT and Wikipedia discovery, not a complete commercial web index.',
      'Official-source verification may still be required for high-impact or legal claims.'
    ]
  };
}
