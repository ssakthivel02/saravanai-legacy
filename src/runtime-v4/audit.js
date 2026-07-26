import { clean, sha256 } from './core.js';
const EVENTS = new Set(['workspace.proposed', 'membership.proposed', 'role-policy.reviewed', 'sharing.proposed', 'export.proposed', 'retention.reviewed', 'access-review.completed']);

export async function buildAuditEnvelope(input = {}) {
  const eventType = clean(input.eventType, 100).toLowerCase();
  const subjectId = clean(input.subjectId, 120);
  const purpose = clean(input.purpose, 500);
  const findings = [];
  if (!EVENTS.has(eventType)) findings.push('event_type_not_allowlisted');
  if (!subjectId) findings.push('subject_id_required');
  if (!purpose) findings.push('purpose_required');
  return {
    valid: findings.length === 0,
    findings,
    envelope: {
      eventId: crypto.randomUUID(),
      eventType,
      subjectFingerprint: subjectId ? (await sha256(subjectId)).slice(0, 20) : null,
      purpose,
      contentLogged: false,
      persisted: false,
      immutableClaim: false
    }
  };
}
