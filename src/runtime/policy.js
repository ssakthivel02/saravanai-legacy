import { booleanEnv, normaliseText } from './shared.js';
import { enforceTenantBoundary, normaliseTenantId } from './tenant.js';

export const RUNTIME_WAVE_1_ACTIONS = Object.freeze([
  'runtime:context:read',
  'runtime:policy:evaluate',
  'runtime:ai-envelope:validate',
  'runtime:output-safety:check',
  'runtime:observability:read'
]);

const MUTATING_ACTION = /(^|:)(create|update|delete|write|execute|deploy|migrate)(:|$)/i;

export function evaluateRuntimePolicy(context, input = {}, env = {}) {
  const action = normaliseText(input.action, 120).toLowerCase();
  const targetTenantId = normaliseTenantId(input.tenantId);
  const riskScore = Number.isFinite(Number(input.riskScore))
    ? Math.max(0, Math.min(100, Number(input.riskScore)))
    : 0;

  const reasons = [];
  const obligations = ['audit_decision_metadata', 'do_not_log_sensitive_content'];

  if (!context.identity?.ownerAuthorised) {
    reasons.push('owner_authorisation_required');
  }

  const boundary = enforceTenantBoundary(
    context.tenant?.tenantId || '',
    targetTenantId || context.tenant?.tenantId || ''
  );
  if (!boundary.allowed) reasons.push(boundary.code.toLowerCase());

  if (!RUNTIME_WAVE_1_ACTIONS.includes(action)) {
    reasons.push('action_not_allowlisted');
  }

  if (MUTATING_ACTION.test(action)) {
    reasons.push('runtime_wave_1_is_read_and_dry_run_only');
  }

  if (riskScore > 50) {
    reasons.push('risk_score_exceeds_wave_1_threshold');
    obligations.push('independent_step_up_review');
  }

  if (booleanEnv(env.RUNTIME_WAVE1_WRITES_ENABLED)) {
    reasons.push('unsafe_write_flag_must_remain_disabled');
  }

  return {
    allowed: reasons.length === 0,
    action,
    targetTenantId: targetTenantId || context.tenant?.tenantId || null,
    riskScore,
    reasons,
    obligations: [...new Set(obligations)],
    productionWriteAllowed: false,
    decisionMode: 'deny-by-default'
  };
}
