import type { BusinessProcess } from "./model";

export const RELEASE_072_CONTROL_RULES = ["version_positive", "steps_required", "acyclic_dependencies", "idempotency_required_for_writes", "approval_required_for_high_impact"] as const;

export function validateBusinessProcess(input: BusinessProcess): string[] {
  const errors: string[] = [];
  if (!String(input.processId ?? "").trim()) errors.push("processId_required");
  if (!input.stepIds.length) errors.push("stepIds_required");
  if (!input.approvalSteps.length) errors.push("approvalSteps_required");
  if (!input.compensationSteps.length) errors.push("compensationSteps_required");
  if (input.enabled && errors.length) errors.push("enabled_resource_has_validation_errors");
  return [...new Set(errors)];
}

export function release072Ready(input: BusinessProcess): boolean {
  return validateBusinessProcess(input).length === 0;
}
