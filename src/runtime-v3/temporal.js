import { cleanText, isoDate } from './shared.js';

export function verifyTemporalContext(input = {}) {
  const asOfDate = isoDate(input.asOfDate);
  const sourceDate = isoDate(input.sourceDate);
  const category = cleanText(input.category, 80).toLowerCase();
  const findings = [];

  if (!asOfDate) findings.push('as_of_date_required');
  if (!sourceDate) findings.push('source_date_required');

  let ageDays = null;
  if (asOfDate && sourceDate) {
    ageDays = Math.floor(
      (new Date(`${asOfDate}T00:00:00Z`) - new Date(`${sourceDate}T00:00:00Z`)) /
      86400000
    );
    if (ageDays < 0) findings.push('source_date_after_as_of_date');
  }

  const thresholds = {
    breaking: 2,
    'current-role': 7,
    'software-version': 30,
    pricing: 7,
    regulation: 30,
    general: 365
  };
  const threshold = thresholds[category] ?? thresholds.general;
  const stale = ageDays !== null && ageDays > threshold;

  return {
    valid: findings.length === 0,
    findings,
    asOfDate: asOfDate || null,
    sourceDate: sourceDate || null,
    category: category || 'general',
    ageDays,
    thresholdDays: threshold,
    stale,
    freshnessDecisionMode: 'rule-based'
  };
}
