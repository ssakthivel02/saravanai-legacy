export interface LifecycleDecision {
  decisionId: string;
  capabilityId: string;
  stage: 'planned' | 'active' | 'deprecated' | 'retired';
  noticeAt: string;
  sunsetAt: string | undefined;
  migrationGuideRef: string | undefined;
}

export const RELEASE_177_CONTROLS = ["notice_required", "sunset_requires_migration_guide", "owner_communication_required"] as const;

export function validateLifecycleDecision(value: LifecycleDecision): string[] {
  const errors: string[] = [];
  if (!value.decisionId.trim()) errors.push("decisionId_required");
  if (!value.capabilityId.trim()) errors.push("capabilityId_required");
  if (!value.noticeAt.trim()) errors.push("noticeAt_required");
  return [...new Set(errors)];
}
