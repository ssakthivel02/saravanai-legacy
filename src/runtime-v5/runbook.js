import { clean } from './core.js';
const RUNBOOKS = Object.freeze({
  'worker-5xx': ['confirm-scope', 'inspect-request-ids', 'compare-deployment-version', 'review-safe-rollback'],
  'latency-regression': ['confirm-regions', 'compare-percentiles', 'inspect-upstream-dependency', 'review-capacity'],
  'authentication-failure': ['confirm-access-policy', 'verify-owner-secret-presence', 'inspect-authentication-headers', 'do-not-bypass-access'],
  'data-integrity-risk': ['stop-write-capability', 'preserve-evidence', 'require-security-review', 'do-not-run-migration'],
  'deployment-failure': ['freeze-deployments', 'inspect-build-output', 'compare-bundle', 'review-rollback-plan']
});

export function selectRunbook(input = {}) {
  const symptom = clean(input.symptom, 80).toLowerCase();
  const steps = RUNBOOKS[symptom];
  return {
    valid: Boolean(steps),
    findings: steps ? [] : ['runbook_not_allowlisted'],
    selection: { symptom, steps: steps || [], executionStarted: false, externalCommandsRun: false, humanOwnerRequired: true }
  };
}
