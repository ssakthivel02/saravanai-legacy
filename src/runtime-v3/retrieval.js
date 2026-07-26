import { cleanText } from './shared.js';

const MODES = new Set(['keyword', 'semantic-preview', 'hybrid-preview']);
const SOURCE_TIERS = new Set([
  'official',
  'primary-research',
  'peer-reviewed',
  'standards-body',
  'government',
  'institutional',
  'reference'
]);

export function buildRetrievalPlan(input = {}) {
  const query = cleanText(input.query, 1000);
  const mode = cleanText(input.mode, 50).toLowerCase();
  const sourceTiers = Array.isArray(input.sourceTiers)
    ? input.sourceTiers.slice(0, 7).map((value) => cleanText(value, 80).toLowerCase())
    : [];
  const maxResults = Math.max(1, Math.min(20, Number(input.maxResults || 8)));
  const findings = [];

  if (!query) findings.push('query_required');
  if (!MODES.has(mode)) findings.push('retrieval_mode_not_allowlisted');
  if (!sourceTiers.length) findings.push('source_tier_required');
  if (sourceTiers.some((tier) => !SOURCE_TIERS.has(tier))) {
    findings.push('source_tier_not_allowlisted');
  }

  return {
    valid: findings.length === 0,
    findings,
    plan: {
      query,
      mode,
      sourceTiers: [...new Set(sourceTiers)],
      maxResults,
      tenantId: 'owner',
      executeSearch: false,
      externalFetch: false,
      vectorDatabaseQuery: false,
      contentLogging: false,
      rankingPolicy: [
        'source-authority',
        'direct-relevance',
        'publication-freshness',
        'citation-completeness'
      ]
    }
  };
}
