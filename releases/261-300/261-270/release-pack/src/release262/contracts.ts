export interface WorkflowVersion {
  workflowId: string;
  version: string;
  owner: string;
  stepIds: string[];
  maximumAttempts: number;
  timeoutSeconds: number;
  rollbackRef: string;
  status: 'draft' | 'approved' | 'retired';
}

export const RELEASE_262_CONTROLS = ["owner_required", "steps_required", "retries_bounded", "rollback_required"] as const;

export function validateWorkflowVersion(value: WorkflowVersion): string[] {
  const errors: string[] = [];
  if (!value.workflowId.trim()) errors.push("workflowId_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.stepIds.length) errors.push("stepIds_required");
  if (!Number.isFinite(value.maximumAttempts) || value.maximumAttempts < 0) errors.push("maximumAttempts_invalid");
  if (!Number.isFinite(value.timeoutSeconds) || value.timeoutSeconds < 0) errors.push("timeoutSeconds_invalid");
  if (!value.rollbackRef.trim()) errors.push("rollbackRef_required");
  if (value.maximumAttempts < 1 || value.maximumAttempts > 5) errors.push("maximum_attempts_out_of_range");
  return [...new Set(errors)];
}
