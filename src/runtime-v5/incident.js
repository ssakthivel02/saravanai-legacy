import { boundedNumber, clean } from './core.js';

export function triageIncident(input = {}) {
  const title = clean(input.title, 160);
  const affectedUsersPercent = boundedNumber(input.affectedUsersPercent, 0, 100, 0);
  const durationMinutes = boundedNumber(input.durationMinutes, 0, 10080, 0);
  const dataIntegrityRisk = input.dataIntegrityRisk === true;
  const securityRisk = input.securityRisk === true;
  const fullOutage = input.fullOutage === true;
  const findings = [];
  if (!title) findings.push('title_required');
  let severity = 'SEV4';
  if (securityRisk || dataIntegrityRisk || fullOutage || affectedUsersPercent >= 50) severity = 'SEV1';
  else if (affectedUsersPercent >= 20 || durationMinutes >= 120) severity = 'SEV2';
  else if (affectedUsersPercent >= 5 || durationMinutes >= 30) severity = 'SEV3';
  return {
    valid: findings.length === 0,
    findings,
    triage: {
      title,
      severity,
      commanderRequired: severity === 'SEV1' || severity === 'SEV2',
      securityEscalationRequired: securityRisk,
      customerCommunicationReviewRequired: affectedUsersPercent >= 5,
      incidentCreated: false,
      pageSent: false,
      persisted: false
    }
  };
}
