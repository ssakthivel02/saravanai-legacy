import { cleanText } from './shared.js';

export function analyseContradictions(input = {}) {
  const claims = Array.isArray(input.claims) ? input.claims.slice(0, 12) : [];
  const findings = [];

  if (claims.length < 2) findings.push('at_least_two_claims_required');

  const normalised = claims.map((claim, index) => ({
    claimId: cleanText(claim?.claimId, 120) || `claim-${index + 1}`,
    proposition: cleanText(claim?.proposition, 1000),
    polarity: ['supports', 'disputes', 'uncertain'].includes(claim?.polarity)
      ? claim.polarity
      : 'uncertain',
    sourceIds: Array.isArray(claim?.sourceIds)
      ? claim.sourceIds.slice(0, 10).map((value) => cleanText(value, 100).toLowerCase())
      : []
  }));

  if (normalised.some((claim) => !claim.proposition)) {
    findings.push('claim_proposition_required');
  }

  const polarities = new Set(normalised.map((claim) => claim.polarity));
  const contradictionCandidate =
    polarities.has('supports') && polarities.has('disputes');

  return {
    valid: findings.length === 0,
    findings,
    claims: normalised,
    contradictionCandidate,
    resolutionRequired: contradictionCandidate,
    resolutionMode: 'human-review',
    automatedTruthDecision: false
  };
}
