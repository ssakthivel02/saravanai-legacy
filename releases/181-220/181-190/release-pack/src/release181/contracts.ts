export interface RuntimeExecution {
  executionId: string;
  tenantId: string;
  actorSubject: string;
  capability: string;
  modelRouteId: string;
  maximumSteps: number;
  productionWriteAllowed: false;
  killSwitchAvailable: true;
}

export const RELEASE_181_CONTROLS = ["trusted_identity_required", "bounded_steps_required", "production_write_forbidden", "kill_switch_required"] as const;

export function validateRuntimeExecution(value: RuntimeExecution): string[] {
  const errors: string[] = [];
  if (!value.executionId.trim()) errors.push("executionId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.actorSubject.trim()) errors.push("actorSubject_required");
  if (!value.capability.trim()) errors.push("capability_required");
  if (!value.modelRouteId.trim()) errors.push("modelRouteId_required");
  if (!Number.isFinite(value.maximumSteps) || value.maximumSteps < 0) errors.push("maximumSteps_invalid");
  if (value.productionWriteAllowed !== false) errors.push("productionWriteAllowed_must_remain_false");
  if (value.killSwitchAvailable !== true) errors.push("killSwitchAvailable_must_remain_true");
  if (value.maximumSteps < 1 || value.maximumSteps > 50) errors.push("maximum_steps_out_of_range");
  return [...new Set(errors)];
}
