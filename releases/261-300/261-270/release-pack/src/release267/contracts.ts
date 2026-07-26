export interface RpaExecution {
  executionId: string;
  tenantId: string;
  automationId: string;
  allowedApplications: string[];
  idempotencyKey: string;
  maximumSteps: number;
  productionWriteAllowed: false;
  killSwitchAvailable: true;
}

export const RELEASE_267_CONTROLS = ["application_allowlist_required", "idempotency_required", "production_write_forbidden", "kill_switch_required"] as const;

export function validateRpaExecution(value: RpaExecution): string[] {
  const errors: string[] = [];
  if (!value.executionId.trim()) errors.push("executionId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.automationId.trim()) errors.push("automationId_required");
  if (!value.allowedApplications.length) errors.push("allowedApplications_required");
  if (!value.idempotencyKey.trim()) errors.push("idempotencyKey_required");
  if (!Number.isFinite(value.maximumSteps) || value.maximumSteps < 0) errors.push("maximumSteps_invalid");
  if (value.productionWriteAllowed !== false) errors.push("productionWriteAllowed_must_remain_false");
  if (value.killSwitchAvailable !== true) errors.push("killSwitchAvailable_must_remain_true");
  if (value.maximumSteps < 1 || value.maximumSteps > 50) errors.push("maximum_steps_out_of_range");
  return [...new Set(errors)];
}
