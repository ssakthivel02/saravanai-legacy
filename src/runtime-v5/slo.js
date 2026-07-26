import { boundedNumber, clean } from './core.js';
const INDICATORS = new Set(['availability', 'latency', 'error-rate', 'freshness']);
const WINDOWS = new Set([7, 28, 30, 90]);

export function validateSlo(input = {}) {
  const service = clean(input.service, 120);
  const indicator = clean(input.indicator, 40).toLowerCase();
  const targetPercent = boundedNumber(input.targetPercent, 90, 99.999, 99.9);
  const windowDays = Number(input.windowDays || 30);
  const thresholdMs = boundedNumber(input.thresholdMs, 1, 60000, 1000);
  const findings = [];
  if (!service) findings.push('service_required');
  if (!INDICATORS.has(indicator)) findings.push('indicator_not_allowlisted');
  if (!WINDOWS.has(windowDays)) findings.push('window_not_allowlisted');
  if (indicator !== 'latency' && input.thresholdMs !== undefined) findings.push('latency_threshold_not_applicable');
  return {
    valid: findings.length === 0,
    findings,
    slo: { service, indicator, targetPercent, windowDays, thresholdMs: indicator === 'latency' ? thresholdMs : null, persisted: false }
  };
}

export function evaluateSlo(input = {}) {
  const total = Math.floor(boundedNumber(input.totalEvents, 0, 1_000_000_000, 0));
  const good = Math.floor(boundedNumber(input.goodEvents, 0, total, 0));
  const targetPercent = boundedNumber(input.targetPercent, 90, 99.999, 99.9);
  const findings = [];
  if (total <= 0) findings.push('total_events_must_be_positive');
  if (good > total) findings.push('good_events_exceed_total');
  const achievedPercent = total > 0 ? Number(((good / total) * 100).toFixed(5)) : 0;
  const allowedBad = total * (1 - targetPercent / 100);
  const observedBad = total - good;
  const errorBudgetRemainingPercent = allowedBad > 0 ? Number((((allowedBad - observedBad) / allowedBad) * 100).toFixed(2)) : 0;
  return {
    valid: findings.length === 0,
    findings,
    evaluation: {
      totalEvents: total,
      goodEvents: good,
      targetPercent,
      achievedPercent,
      targetMet: total > 0 && achievedPercent >= targetPercent,
      errorBudgetRemainingPercent,
      alertSent: false,
      persisted: false
    }
  };
}
