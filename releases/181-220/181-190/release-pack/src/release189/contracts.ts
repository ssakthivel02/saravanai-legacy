export interface AiChange {
  changeId: string;
  changeType: 'model' | 'prompt' | 'policy' | 'corpus' | 'agent';
  owner: string;
  impactAssessmentId: string;
  canaryPlanId: string;
  rollbackRef: string;
  approvedBy: string | undefined;
  status: 'draft' | 'approved' | 'deployed' | 'rolled_back';
}

export const RELEASE_189_CONTROLS = ["impact_assessment_required", "canary_required", "rollback_required", "approval_required"] as const;

export function validateAiChange(value: AiChange): string[] {
  const errors: string[] = [];
  if (!value.changeId.trim()) errors.push("changeId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.impactAssessmentId.trim()) errors.push("impactAssessmentId_required");
  if (!value.canaryPlanId.trim()) errors.push("canaryPlanId_required");
  if (!value.rollbackRef.trim()) errors.push("rollbackRef_required");
  return [...new Set(errors)];
}
