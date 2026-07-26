import { clean } from './core.js';

const SAFE_EVENTS = new Set(['pull_request', 'push', 'workflow_dispatch', 'schedule']);

export function evaluateWorkflow(input = {}) {
  const name = clean(input.name, 120);
  const event = clean(input.event, 50).toLowerCase();
  const actions = Array.isArray(input.actions) ? input.actions.slice(0, 100) : [];
  const permissions = input.permissions && typeof input.permissions === 'object' ? input.permissions : {};
  const findings = [];
  if (!name) findings.push('name_required');
  if (!SAFE_EVENTS.has(event)) findings.push('event_not_allowlisted');
  if (event === 'pull_request_target') findings.push('pull_request_target_denied');

  const writePermissions = Object.entries(permissions)
    .filter(([, value]) => String(value).toLowerCase() === 'write')
    .map(([key]) => key);
  if (writePermissions.length) findings.push('write_permission_present');

  const actionResults = actions.map((action, index) => {
    const uses = clean(action?.uses, 300);
    const thirdParty = uses && !uses.startsWith('actions/') && !uses.startsWith('./');
    const ref = uses.includes('@') ? uses.split('@').pop() : '';
    const pinnedToSha = /^[a-f0-9]{40}$/i.test(ref);
    if (!uses) findings.push(`action_${index}_uses_required`);
    if (thirdParty && !pinnedToSha) findings.push(`action_${index}_third_party_not_sha_pinned`);
    if (action?.secretsInPullRequest === true) findings.push(`action_${index}_secrets_in_pull_request_denied`);
    return { uses, thirdParty, pinnedToSha };
  });

  return {
    valid: findings.length === 0,
    findings: [...new Set(findings)],
    assessment: {
      name,
      event,
      writePermissions,
      actions: actionResults,
      workflowChanged: false,
      repositorySettingsChanged: false,
      persisted: false
    }
  };
}
