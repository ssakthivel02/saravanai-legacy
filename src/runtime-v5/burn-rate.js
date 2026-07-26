import { boundedNumber } from './core.js';

export function evaluateBurnRate(input = {}) {
  const targetPercent = boundedNumber(input.targetPercent, 90, 99.999, 99.9);
  const shortErrorRate = boundedNumber(input.shortWindowErrorRatePercent, 0, 100, 0);
  const longErrorRate = boundedNumber(input.longWindowErrorRatePercent, 0, 100, 0);
  const budgetRate = Math.max(0.00001, 100 - targetPercent);
  const shortBurnRate = Number((shortErrorRate / budgetRate).toFixed(2));
  const longBurnRate = Number((longErrorRate / budgetRate).toFixed(2));
  let severity = 'normal';
  if (shortBurnRate >= 14.4 && longBurnRate >= 6) severity = 'critical';
  else if (shortBurnRate >= 6 && longBurnRate >= 3) severity = 'high';
  else if (shortBurnRate >= 2 || longBurnRate >= 1) severity = 'watch';
  return {
    valid: true,
    findings: [],
    evaluation: { targetPercent, shortBurnRate, longBurnRate, severity, alertSent: false, incidentCreated: false, humanReviewRequired: severity !== 'normal' }
  };
}
