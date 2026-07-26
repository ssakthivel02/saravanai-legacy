import { text } from './shared.js';
import { assessToolRequest } from './tool-registry.js';

export function createLeaseProposal(input = {}, context = {}) {
  const toolId = text(input.toolId, 100);
  const assessment = assessToolRequest(toolId);
  const requestedSeconds = Number(input.durationSeconds || 60);
  const durationSeconds = Math.max(30, Math.min(300, Number.isFinite(requestedSeconds) ? requestedSeconds : 60));
  const reasons = [];

  if (!assessment.allowed) reasons.push(assessment.code.toLowerCase());
  if (input.execute === true) reasons.push('execution_flag_denied');
  if (input.write === true) reasons.push('write_flag_denied');

  return {
    valid: reasons.length === 0,
    proposalId: crypto.randomUUID(),
    tenantId: context.tenantId || 'owner',
    toolId,
    durationSeconds,
    expiresAt: new Date(Date.now() + durationSeconds * 1000).toISOString(),
    scope: ['preview', 'read-only', 'no-network-side-effect'],
    executionAllowed: false,
    writeAllowed: false,
    persisted: false,
    cryptographicAuthority: false,
    reasons,
    approvalRequired: Boolean(assessment.definition?.humanApproval),
    warning: 'This is a non-authoritative lease proposal and cannot execute a tool.'
  };
}
