export interface FeatureFlag {
  flagId: string;
  owner: string;
  defaultEnabled: boolean;
  targetingRules: string[];
  expiresAt: string;
  killSwitchAvailable: true;
}

export const RELEASE_164_CONTROLS = ["owner_required", "expiry_required", "kill_switch_required"] as const;

export function validateFeatureFlag(value: FeatureFlag): string[] {
  const errors: string[] = [];
  if (!value.flagId.trim()) errors.push("flagId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.targetingRules.length) errors.push("targetingRules_required");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  if (value.killSwitchAvailable !== true) errors.push("killSwitchAvailable_must_remain_true");
  return [...new Set(errors)];
}
