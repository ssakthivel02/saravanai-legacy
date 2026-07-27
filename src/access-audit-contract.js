export const ACCESS_AUDIT_RELEASE = 'access-decision-audit-contract-1.0.0';

const DECISIONS = new Set(['allow', 'deny', 'bypass-disabled']);
const ROLES = new Set(['owner', 'member', 'reader', 'public', 'unknown']);

function safe(value, max = 96) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function createAccessDecisionEvent({
  requestId,
  routeId,
  method,
  role,
  decision,
  code,
  classification,
  serverMutation = false,
  timestamp = new Date().toISOString()
} = {}) {
  return Object.freeze({
    release: ACCESS_AUDIT_RELEASE,
    type: 'sakthiai.access.decision',
    requestId: safe(requestId, 128) || 'unavailable',
    routeId: safe(routeId) || 'unclassified-protected-route',
    method: safe(method, 12).toUpperCase() || 'GET',
    role: ROLES.has(role) ? role : 'unknown',
    decision: DECISIONS.has(decision) ? decision : 'deny',
    code: safe(code) || 'ACCESS_DECISION_UNSPECIFIED',
    classification: safe(classification) || 'unclassified',
    serverMutation: serverMutation === true,
    timestamp: safe(timestamp, 64),
    identityIncluded: false,
    emailIncluded: false,
    tokenIncluded: false,
    profileKeyIncluded: false,
    persistence: 'none-contract-only'
  });
}

export function accessAuditContractSummary() {
  return {
    release: ACCESS_AUDIT_RELEASE,
    persistenceEnabled: false,
    externalLoggingEnabled: false,
    identityFieldsProhibited: ['email', 'jwt', 'profileKey', 'subject'],
    allowedDecisions: [...DECISIONS],
    purpose: 'metadata-only authorisation evidence contract'
  };
}

export const __test = { safe };
