import { cleanText, isoDate } from './shared.js';

const SOURCE_TYPES = new Set([
  'official',
  'primary-research',
  'peer-reviewed',
  'standards-body',
  'government',
  'institutional',
  'reference',
  'community'
]);

const LICENSES = new Set([
  'public-domain',
  'cc-by',
  'cc-by-sa',
  'open-government',
  'permission-confirmed',
  'link-only',
  'unknown'
]);

export function validateSourceRecord(input = {}) {
  const sourceId = cleanText(input.sourceId, 100).toLowerCase();
  const title = cleanText(input.title, 300);
  const sourceType = cleanText(input.sourceType, 80).toLowerCase();
  const canonicalUrl = cleanText(input.canonicalUrl, 1000);
  const publishedDate = isoDate(input.publishedDate);
  const accessedDate = isoDate(input.accessedDate);
  const license = cleanText(input.license, 80).toLowerCase();
  const findings = [];

  if (!/^[a-z0-9][a-z0-9._:-]{2,99}$/.test(sourceId)) {
    findings.push('source_id_invalid');
  }
  if (!title) findings.push('title_required');
  if (!SOURCE_TYPES.has(sourceType)) findings.push('source_type_not_allowlisted');

  if (canonicalUrl) {
    try {
      const parsed = new URL(canonicalUrl);
      if (parsed.protocol !== 'https:') findings.push('https_required');
      if (parsed.username || parsed.password) findings.push('embedded_credentials_denied');
      if (['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)) {
        findings.push('local_or_loopback_url_denied');
      }
    } catch {
      findings.push('canonical_url_invalid');
    }
  } else {
    findings.push('canonical_url_required');
  }

  if (!accessedDate) findings.push('accessed_date_required');
  if (input.publishedDate && !publishedDate) findings.push('published_date_invalid');
  if (!LICENSES.has(license)) findings.push('license_not_allowlisted');

  return {
    valid: findings.length === 0,
    source: {
      sourceId,
      title,
      sourceType,
      canonicalUrl,
      publishedDate: publishedDate || null,
      accessedDate: accessedDate || null,
      license,
      contentStored: false,
      registrationMode: 'preview-only'
    },
    findings
  };
}
