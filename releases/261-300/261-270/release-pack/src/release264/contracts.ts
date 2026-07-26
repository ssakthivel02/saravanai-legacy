export interface HumanTask {
  taskId: string;
  tenantId: string;
  requester: string;
  assignee: string;
  dueAt: string;
  evidenceRefs: string[];
  escalationRole: string;
  status: 'open' | 'approved' | 'rejected' | 'expired';
}

export const RELEASE_264_CONTROLS = ["requester_assignee_separation", "due_date_required", "evidence_required", "escalation_required"] as const;

export function validateHumanTask(value: HumanTask): string[] {
  const errors: string[] = [];
  if (!value.taskId.trim()) errors.push("taskId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.requester.trim()) errors.push("requester_required");
  if (!value.assignee.trim()) errors.push("assignee_required");
  if (!value.dueAt.trim()) errors.push("dueAt_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.escalationRole.trim()) errors.push("escalationRole_required");
  if (value.requester === value.assignee) errors.push("self_approval_forbidden");
  return [...new Set(errors)];
}
