import { clean } from './core.js';
const CONDITIONS = new Set(['slo-breach', 'error-budget-burn', 'service-unavailable', 'security-risk', 'deployment-failure']);
const DESTINATIONS = new Set(['dashboard-only', 'owner-review-queue']);

export function validateAlertPolicy(input = {}) {
  const name = clean(input.name, 120);
  const condition = clean(input.condition, 80).toLowerCase();
  const destination = clean(input.destination, 80).toLowerCase();
  const findings = [];
  if (!name) findings.push('name_required');
  if (!CONDITIONS.has(condition)) findings.push('condition_not_allowlisted');
  if (!DESTINATIONS.has(destination)) findings.push('destination_not_allowlisted');
  if (input.webhookUrl) findings.push('external_webhook_denied');
  if (input.sendNow === true) findings.push('alert_sending_denied');
  return {
    valid: findings.length === 0,
    findings,
    policy: { name, condition, destination, externalDelivery: false, alertSent: false, policyPersisted: false }
  };
}
