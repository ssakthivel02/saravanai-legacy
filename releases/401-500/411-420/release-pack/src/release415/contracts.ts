export interface LocalRetrievalAndKnowledgeSynchronisation {
  executionId: string;
  tenantId: string;
  owner: string;
  idempotencyKey: string;
  maximumSteps: number;
  approvalId: string | undefined;
  dryRun: boolean;
  productionWriteAllowed: false;
  killSwitchAvailable: true;
  status: 'planned' | 'running' | 'completed' | 'failed' | 'cancelled';
}

export const RELEASE_415_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "idempotency_required", "kill_switch_required", "production_write_forbidden", "citation_and_access_filter_required", "device_posture_required"] as const;

export function validateLocalRetrievalAndKnowledgeSynchronisation(value: LocalRetrievalAndKnowledgeSynchronisation): string[] {
  const errors: string[] = [];
  if (!value.executionId.trim()) errors.push("executionId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.idempotencyKey.trim()) errors.push("idempotencyKey_required");
  if (!Number.isFinite(value.maximumSteps) || value.maximumSteps < 0) errors.push("maximumSteps_invalid");
  if (value.productionWriteAllowed !== false) errors.push("productionWriteAllowed_must_remain_false");
  if (value.killSwitchAvailable !== true) errors.push("killSwitchAvailable_must_remain_true");
  if (value.maximumSteps < 1 || value.maximumSteps > 50) errors.push("maximum_steps_out_of_range");
  return [...new Set(errors)];
}
