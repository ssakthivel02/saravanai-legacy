export interface AgentExecutionRequestAndPurposeContract {
  executionId: string;
  tenantId: string;
  actorSubject: string;
  purpose: string;
  idempotencyKey: string;
  maximumSteps: number;
  approvalId: string | undefined;
  dryRun: boolean;
  productionWriteAllowed: false;
  killSwitchAvailable: true;
  status: 'planned' | 'running' | 'completed' | 'failed' | 'cancelled';
}

export const RELEASE_821_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "idempotency_required", "kill_switch_required", "production_write_forbidden", "bounded_agent_authority_required"] as const;

export function validateAgentExecutionRequestAndPurposeContract(value: AgentExecutionRequestAndPurposeContract): string[] {
  const errors: string[] = [];
  if (!value.executionId.trim()) errors.push("executionId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.actorSubject.trim()) errors.push("actorSubject_required");
  if (!value.purpose.trim()) errors.push("purpose_required");
  if (!value.idempotencyKey.trim()) errors.push("idempotencyKey_required");
  if (!Number.isFinite(value.maximumSteps) || value.maximumSteps < 0) errors.push("maximumSteps_invalid");
  if (value.productionWriteAllowed !== false) errors.push("productionWriteAllowed_must_remain_false");
  if (value.killSwitchAvailable !== true) errors.push("killSwitchAvailable_must_remain_true");
  if (value.maximumSteps < 1 || value.maximumSteps > 50) errors.push("maximum_steps_out_of_range");
  return [...new Set(errors)];
}
