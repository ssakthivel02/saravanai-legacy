export interface IntegrationFlow {
  flowId: string;
  tenantId: string;
  owner: string;
  steps: string[];
  compensationSteps: string[];
  maximumAttempts: number;
  timeoutSeconds: number;
  enabled: boolean;
}

export const RELEASE_194_CONTROLS = ["owner_required", "steps_required", "retries_bounded", "compensation_required_for_writes"] as const;

export function validateIntegrationFlow(value: IntegrationFlow): string[] {
  const errors: string[] = [];
  if (!value.flowId.trim()) errors.push("flowId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.steps.length) errors.push("steps_required");
  if (!value.compensationSteps.length) errors.push("compensationSteps_required");
  if (!Number.isFinite(value.maximumAttempts) || value.maximumAttempts < 0) errors.push("maximumAttempts_invalid");
  if (!Number.isFinite(value.timeoutSeconds) || value.timeoutSeconds < 0) errors.push("timeoutSeconds_invalid");
  if (value.maximumAttempts < 1 || value.maximumAttempts > 5) errors.push("maximum_attempts_out_of_range");
  return [...new Set(errors)];
}
