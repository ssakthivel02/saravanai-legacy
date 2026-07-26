import { cleanText } from './shared.js';

const SOURCE_ID_PATTERN = /^[a-z0-9][a-z0-9._:-]{2,99}$/;

export function validateCitationSet(input = {}) {
  const claimId = cleanText(input.claimId, 120);
  const citations = Array.isArray(input.citations) ? input.citations.slice(0, 20) : [];
  const findings = [];

  if (!claimId) findings.push('claim_id_required');
  if (!citations.length) findings.push('citation_required');

  const normalised = citations.map((citation, index) => {
    const sourceId = cleanText(citation?.sourceId, 100).toLowerCase();
    const locator = cleanText(citation?.locator, 200);
    const quoteLength = Number(citation?.quoteLength || 0);
    const itemFindings = [];

    if (!SOURCE_ID_PATTERN.test(sourceId)) itemFindings.push('source_id_invalid');
    if (!locator) itemFindings.push('locator_required');
    if (quoteLength < 0 || quoteLength > 25) itemFindings.push('quote_length_limit_exceeded');

    return {
      sequence: index + 1,
      sourceId,
      locator,
      quoteLength,
      supported: itemFindings.length === 0,
      findings: itemFindings
    };
  });

  if (normalised.some((item) => !item.supported)) {
    findings.push('one_or_more_citations_invalid');
  }

  return {
    valid: findings.length === 0,
    claimId,
    citations: normalised,
    findings,
    claimVerified: false,
    verificationMode: 'structure-only',
    sourceContentFetched: false
  };
}
