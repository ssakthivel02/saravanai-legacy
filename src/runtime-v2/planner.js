import { text } from './shared.js';
import { getToolDefinition } from './tool-registry.js';

const STEP_TYPES = new Set(['analyse', 'retrieve-preview', 'evaluate', 'human-review', 'compose']);

export function compileBoundedPlan(input = {}) {
  const objective = text(input.objective, 500);
  const suppliedSteps = Array.isArray(input.steps) ? input.steps.slice(0, 8) : [];
  const findings = [];

  if (!objective) findings.push('objective_required');
  if (!suppliedSteps.length) findings.push('at_least_one_step_required');
  if (Array.isArray(input.steps) && input.steps.length > 8) findings.push('step_limit_exceeded');

  const steps = suppliedSteps.map((step, index) => {
    const type = STEP_TYPES.has(step?.type) ? step.type : '';
    const toolId = text(step?.toolId, 100);
    const tool = toolId ? getToolDefinition(toolId) : null;
    const stepFindings = [];

    if (!type) stepFindings.push('step_type_not_allowlisted');
    if (toolId && !tool) stepFindings.push('tool_not_allowlisted');
    if (tool?.writes || tool?.external) stepFindings.push('write_or_external_tool_denied');

    return {
      sequence: index + 1,
      type: type || 'invalid',
      description: text(step?.description, 300),
      toolId: toolId || null,
      humanApprovalRequired: Boolean(tool?.humanApproval || type === 'human-review'),
      executionAllowed: false,
      findings: stepFindings
    };
  });

  if (steps.some((step) => step.findings.length)) findings.push('one_or_more_steps_invalid');

  return {
    valid: findings.length === 0,
    objective,
    findings,
    steps,
    maxSteps: 8,
    executionMode: 'plan-only',
    externalCallsAllowed: false,
    productionWritesAllowed: false,
    humanAccountable: true
  };
}
