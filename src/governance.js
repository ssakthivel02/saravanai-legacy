export const GOVERNANCE_RELEASE = '0.20.0-governance-foundation';

const RELEASES = [
  { id: '012', name: 'Private identity and session boundary', status: 'foundation-ready', publicEnabled: false },
  { id: '013', name: 'Tenant isolation and data governance', status: 'foundation-ready', publicEnabled: false },
  { id: '014', name: 'Editorial verification and publication controls', status: 'foundation-ready', publicEnabled: false },
  { id: '015', name: 'Agent and tool security', status: 'foundation-ready', publicEnabled: false },
  { id: '016', name: 'Prompt, model and retrieval optimisation', status: 'design-ready', publicEnabled: false },
  { id: '017', name: 'Privacy, safety and compliance evidence', status: 'foundation-ready', publicEnabled: false },
  { id: '018', name: 'Resilience, incident response and disaster recovery', status: 'foundation-ready', publicEnabled: false },
  { id: '019', name: 'Customer trust, transparency and regional controls', status: 'foundation-ready', publicEnabled: false },
  { id: '020', name: 'Production certification and launch governance', status: 'gated', publicEnabled: false }
];

const PILLARS = [
  { id: 'identity', title: 'Identity and access', controls: ['deny-by-default', 'strong-authentication', 'least-privilege', 'session-expiry', 'step-up-approval'] },
  { id: 'privacy', title: 'Privacy and data protection', controls: ['data-minimisation', 'purpose-limitation', 'retention', 'deletion-export', 'regional-policy'] },
  { id: 'ai-safety', title: 'AI safety and integrity', controls: ['freshness-gate', 'citation-provenance', 'uncertainty-disclosure', 'prompt-injection-defence', 'human-approval'] },
  { id: 'tools', title: 'Agent and tool security', controls: ['allowlists', 'dry-run', 'idempotency', 'rollback', 'append-only-audit'] },
  { id: 'customer', title: 'Customer and tenant security', controls: ['tenant-isolation', 'customer-admin-boundary', 'abuse-protection', 'support-access-control', 'security-notification'] },
  { id: 'resilience', title: 'Operational resilience', controls: ['health-monitoring', 'rate-limits', 'backup-restore', 'incident-response', 'disaster-recovery'] },
  { id: 'compliance', title: 'Compliance and assurance', controls: ['control-mapping', 'evidence-register', 'risk-acceptance', 'supplier-assurance', 'release-certification'] },
  { id: 'global', title: 'Global and community safety', controls: ['local-law-precedence', 'emergency-escalation', 'child-safeguarding', 'accessibility', 'cultural-respect'] }
];

const FRAMEWORKS = [
  { id: 'iso27001', name: 'ISO/IEC 27001', type: 'security-management', posture: 'mapping-prepared', certificationClaim: false },
  { id: 'iso27701', name: 'ISO/IEC 27701', type: 'privacy-management', posture: 'mapping-prepared', certificationClaim: false },
  { id: 'iso42001', name: 'ISO/IEC 42001', type: 'ai-management', posture: 'mapping-prepared', certificationClaim: false },
  { id: 'nist-csf', name: 'NIST Cybersecurity Framework', type: 'cybersecurity', posture: 'mapping-prepared', certificationClaim: false },
  { id: 'nist-ai-rmf', name: 'NIST AI Risk Management Framework', type: 'ai-risk', posture: 'mapping-prepared', certificationClaim: false },
  { id: 'owasp-llm', name: 'OWASP Top 10 for LLM Applications', type: 'application-security', posture: 'mapping-prepared', certificationClaim: false },
  { id: 'soc2', name: 'SOC 2 Trust Services Criteria', type: 'assurance', posture: 'future-readiness', certificationClaim: false },
  { id: 'gdpr', name: 'UK GDPR / EU GDPR principles', type: 'privacy-law', posture: 'principles-mapped-legal-review-required', certificationClaim: false },
  { id: 'eu-ai-act', name: 'EU AI Act', type: 'ai-regulation', posture: 'classification-and-obligations-review-required', certificationClaim: false }
];

const HARD_GATES = [
  'No public registration before authenticated tenant isolation is tested.',
  'No paid provider activation without explicit owner approval and budget controls.',
  'No external write tool without human approval, idempotency and rollback.',
  'No compliance, certification or legal-conformity claim without independent evidence.',
  'No current high-impact claim from stale model memory.',
  'No confidential customer data in browser-local preview mode.',
  'No production launch without incident response, restore testing and security sign-off.'
];

function json(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    }
  });
}

function accessIdentity(request) {
  const email = request.headers.get('cf-access-authenticated-user-email');
  const jwt = request.headers.get('cf-access-jwt-assertion');
  return { authenticated: Boolean(email && jwt), email: email || null, source: email && jwt ? 'cloudflare-access' : 'none' };
}

export function governanceSnapshot(env = {}) {
  return {
    release: GOVERNANCE_RELEASE,
    operatingMode: 'private-owner-free-first',
    publicRegistration: false,
    commercialProvidersEnabled: false,
    serverTenantWritesEnabled: Boolean(env.SAKTHI_DB) && String(env.PUBLIC_TENANT_WRITES || '').toLowerCase() === 'true',
    certificationClaims: false,
    releases: RELEASES,
    pillars: PILLARS,
    frameworks: FRAMEWORKS,
    hardGates: HARD_GATES,
    disclaimer: 'Framework mapping is implementation guidance, not legal advice, certification or proof of regulatory conformity.'
  };
}

export function handleGovernance(request, env, url) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' }, 405);

  if (url.pathname === '/api/v1/governance') return json(governanceSnapshot(env));
  if (url.pathname === '/api/v1/governance/releases') return json({ release: GOVERNANCE_RELEASE, releases: RELEASES });
  if (url.pathname === '/api/v1/governance/pillars') return json({ release: GOVERNANCE_RELEASE, pillars: PILLARS, hardGates: HARD_GATES });
  if (url.pathname === '/api/v1/governance/frameworks') return json({ release: GOVERNANCE_RELEASE, frameworks: FRAMEWORKS, certificationClaims: false });
  if (url.pathname === '/api/v1/governance/access') {
    const identity = accessIdentity(request);
    return json({ release: GOVERNANCE_RELEASE, identity, ownerWriteAuthorised: identity.authenticated && String(env.OWNER_EMAIL || '').toLowerCase() === String(identity.email || '').toLowerCase(), publicRegistration: false });
  }

  return json({ error: 'Governance API route not found.', code: 'GOVERNANCE_ROUTE_NOT_FOUND' }, 404);
}
