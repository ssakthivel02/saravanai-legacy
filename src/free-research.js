const GDELT_ENDPOINT = 'https://api.gdeltproject.org/api/v2/doc/doc';
const WIKIDATA_ENDPOINT = 'https://www.wikidata.org/w/api.php';

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

function cleanResearchQuery(value = '') {
  return stripHtml(value)
    .replace(/\b(could you|would you|can you|please|kindly|tell me|share|provide|hey)\b/gi, ' ')
    .replace(/\b(name|details|information)\b(?=\s*[?.!]*$)/gi, ' ')
    .replace(/[?.!]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function officeHolderQueries(prompt = '') {
  const cleaned = cleanResearchQuery(prompt)
    .replace(/\b(who is|what is|current|currently|the|a|an)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const hasRole = /\b(chief minister|prime minister|president|governor|mayor|chief executive officer|ceo)\b/i.test(cleaned)
    || /(முதலமைச்சர்|முதல்வர்|பிரதமர்|குடியரசுத் தலைவர்|ஆளுநர்|மேயர்)/.test(cleaned);
  if (!hasRole || cleaned.length < 6) return [];

  const variants = [cleaned];
  const locationFirst = cleaned.match(/^(.+?)\s+(chief minister|governor|mayor)$/i);
  if (locationFirst) variants.unshift(`${locationFirst[2]} of ${locationFirst[1]}`);
  const organisationFirst = cleaned.match(/^(.+?)\s+(chief executive officer|ceo)$/i);
  if (organisationFirst) variants.unshift(`chief executive officer of ${organisationFirst[1]}`);
  return unique(variants).slice(0, 3);
}

async function fetchJson(fetcher, url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(url, {
      headers: { 'User-Agent': 'SakthiAI/0.14.0 (+https://sakthiai.omsaravanabhava.org)' },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function safePublicHttpsUrl(value = '') {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || !host || host === 'localhost' || host.endsWith('.local')) return '';
    if (/^(?:127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(host)) return '';
    if (host === '::1' || host.startsWith('[')) return '';
    return url.href;
  } catch {
    return '';
  }
}

async function fetchText(fetcher, url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(url, {
      headers: { 'User-Agent': 'SakthiAI/0.14.0 (+https://sakthiai.omsaravanabhava.org)' },
      redirect: 'follow',
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
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

async function searchWikidataEntities(query, fetcher) {
  const url = new URL(WIKIDATA_ENDPOINT);
  url.searchParams.set('action', 'wbsearchentities');
  url.searchParams.set('search', query);
  url.searchParams.set('language', 'en');
  url.searchParams.set('uselang', 'en');
  url.searchParams.set('type', 'item');
  url.searchParams.set('limit', '5');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');
  const payload = await fetchJson(fetcher, url);
  return (payload?.search || []).filter((item) => /^Q\d+$/.test(item?.id || ''));
}

async function fetchWikidataEntities(ids, fetcher) {
  const cleanIds = unique(ids).filter((id) => /^Q\d+$/.test(id));
  if (!cleanIds.length) return {};
  const url = new URL(WIKIDATA_ENDPOINT);
  url.searchParams.set('action', 'wbgetentities');
  url.searchParams.set('ids', cleanIds.join('|'));
  url.searchParams.set('props', 'labels|descriptions|claims');
  url.searchParams.set('languages', 'en|ta');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');
  const payload = await fetchJson(fetcher, url);
  return payload?.entities || {};
}

function hasEndQualifier(statement = {}) {
  return Array.isArray(statement?.qualifiers?.P582) && statement.qualifiers.P582.length > 0;
}

function statementEntityId(statement = {}) {
  const value = statement?.mainsnak?.datavalue?.value;
  if (!value || typeof value !== 'object') return '';
  if (typeof value.id === 'string') return value.id;
  if (Number.isInteger(value['numeric-id'])) return `Q${value['numeric-id']}`;
  return '';
}

function selectCurrentStatement(statements = []) {
  return [...statements]
    .filter((statement) => statement?.rank !== 'deprecated' && statementEntityId(statement) && !hasEndQualifier(statement))
    .sort((left, right) => Number(right.rank === 'preferred') - Number(left.rank === 'preferred'))[0] || null;
}

function entityLabel(entity = {}, language = 'en') {
  return entity?.labels?.[language]?.value || entity?.labels?.en?.value || entity?.labels?.ta?.value || '';
}

function officialWebsite(entity = {}) {
  for (const statement of entity?.claims?.P856 || []) {
    const value = statement?.mainsnak?.datavalue?.value;
    if (typeof value === 'string' && /^https:\/\//i.test(value)) return value;
  }
  return '';
}

function wikidataCitation(id, title, snippet) {
  return {
    title,
    url: `https://www.wikidata.org/wiki/${id}`,
    snippet,
    sourceType: 'knowledge-graph',
    publishedAt: null
  };
}

async function verifyOfficialWebsite(url, expectedName, fetcher) {
  const safeUrl = safePublicHttpsUrl(url);
  if (!safeUrl || !expectedName) return null;
  try {
    const html = await fetchText(fetcher, safeUrl);
    const text = stripHtml(html).slice(0, 120000);
    const index = text.toLocaleLowerCase('en').indexOf(expectedName.toLocaleLowerCase('en'));
    if (index < 0) return null;
    return {
      title: 'Official website verification',
      url: safeUrl,
      snippet: text.slice(Math.max(0, index - 120), Math.min(text.length, index + expectedName.length + 180)),
      sourceType: 'official-website',
      publishedAt: null
    };
  } catch {
    return null;
  }
}

async function resolveCurrentOfficeHolder(prompt, fetcher) {
  const queries = officeHolderQueries(prompt);
  for (const query of queries) {
    const candidates = await searchWikidataEntities(query, fetcher);
    if (!candidates.length) continue;
    const entities = await fetchWikidataEntities(candidates.map((candidate) => candidate.id), fetcher);

    for (const candidate of candidates) {
      const position = entities[candidate.id];
      const current = selectCurrentStatement(position?.claims?.P1308 || []);
      const holderId = statementEntityId(current || {});
      if (!holderId) continue;

      const holder = (await fetchWikidataEntities([holderId], fetcher))[holderId];
      const positionLabelEn = entityLabel(position, 'en') || candidate.label || query;
      const positionLabelTa = entityLabel(position, 'ta');
      const holderLabelEn = entityLabel(holder, 'en');
      const holderLabelTa = entityLabel(holder, 'ta');
      if (!holderLabelEn && !holderLabelTa) continue;

      const website = officialWebsite(position) || officialWebsite(holder);
      const official = await verifyOfficialWebsite(website, holderLabelEn || holderLabelTa, fetcher);
      const citations = [
        wikidataCitation(candidate.id, positionLabelEn, `Wikidata current-position statement for ${positionLabelEn}.`),
        wikidataCitation(holderId, holderLabelEn || holderLabelTa, 'Wikidata identity record for the current office holder.')
      ];
      if (official) citations.unshift(official);

      return {
        positionId: candidate.id,
        holderId,
        positionLabelEn,
        positionLabelTa,
        holderLabelEn,
        holderLabelTa,
        officialVerified: Boolean(official),
        citations
      };
    }
  }
  return null;
}

function officeHolderAnswer(fact, prompt, checkedAt) {
  const checkedDate = new Date(checkedAt).toISOString().slice(0, 10);
  if (isTamil(prompt)) {
    const holder = fact.holderLabelTa || fact.holderLabelEn;
    const position = fact.positionLabelTa || fact.positionLabelEn;
    const evidence = fact.officialVerified ? 'அதிகாரப்பூர்வ இணையதளத்திலும் பெயர் பொருந்துகிறது.' : 'Wikidata-வின் தற்போதைய பதவி பதிவின் அடிப்படையில்.';
    const refs = fact.officialVerified ? '[1] [2] [3]' : '[1] [2]';
    return `**${holder}** தற்போது **${position}** பதவியில் உள்ளார். ${evidence} சரிபார்க்கப்பட்ட தேதி: ${checkedDate}. ${refs}`;
  }
  const evidence = fact.officialVerified
    ? 'The linked official website also contains the same name.'
    : 'This is based on Wikidata’s current office-holder statement; confirm against the linked official authority for high-impact use.';
  const refs = fact.officialVerified ? '[1] [2] [3]' : '[1] [2]';
  return `**${fact.holderLabelEn || fact.holderLabelTa}** is the current **${fact.positionLabelEn}**. ${evidence} Checked: ${checkedDate}. ${refs}`;
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
  const checkedAt = new Date().toISOString();
  const query = cleanResearchQuery(prompt) || prompt;

  try {
    const officeHolder = await resolveCurrentOfficeHolder(prompt, fetcher);
    if (officeHolder) {
      return {
        answer: officeHolderAnswer(officeHolder, prompt, checkedAt),
        citations: officeHolder.citations.map((source, index) => ({ ...source, index: index + 1 })),
        searchedAt: checkedAt,
        model: 'deterministic-office-holder-resolver-v1',
        provider: 'free-research-wikidata',
        costClass: 'free-first',
        connectorFailures: failures,
        limitations: officeHolder.officialVerified
          ? ['The answer was resolved from a current knowledge-graph statement and matched against the linked official website.']
          : ['The current office-holder statement was resolved from Wikidata; official-source confirmation is still recommended for high-impact use.']
      };
    }
  } catch (error) {
    failures.push({ connector: 'wikidata-office-holder', error: error?.message || 'Wikidata office-holder resolution failed' });
  }

  try {
    results.push(...await searchGdelt(query, fetcher));
  } catch (error) {
    failures.push({ connector: 'gdelt', error: error?.message || 'GDELT failed' });
  }

  try {
    results.push(...await searchWikipedia(query, isTamil(prompt) ? 'ta' : 'en', fetcher));
  } catch (error) {
    failures.push({ connector: 'wikipedia', error: error?.message || 'Wikipedia failed' });
  }

  const sources = deduplicate(results).slice(0, 10);
  if (!sources.length) throw new Error(`Free research connectors returned no sources: ${JSON.stringify(failures)}`);
  if (!env.AI) throw new Error('Workers AI binding is unavailable for source synthesis.');

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
      'Free research uses Wikidata office-holder resolution, GDELT and Wikipedia discovery, not a complete commercial web index.',
      'Official-source verification may still be required for high-impact or legal claims.'
    ]
  };
}

export const __test = {
  cleanResearchQuery,
  entityLabel,
  officeHolderAnswer,
  officeHolderQueries,
  safePublicHttpsUrl,
  selectCurrentStatement,
  statementEntityId
};
