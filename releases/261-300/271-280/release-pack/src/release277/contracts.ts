export interface ChildSafetyProfile {
  profileId: string;
  ageBand: 'child' | 'teen';
  parentalControlRequired: true;
  behaviouralProfilingAllowed: false;
  safeguardingOwner: string;
  reportingChannel: string;
  status: 'draft' | 'approved' | 'retired';
}

export const RELEASE_277_CONTROLS = ["parental_control_required", "profiling_forbidden", "safeguarding_owner_required", "reporting_channel_required"] as const;

export function validateChildSafetyProfile(value: ChildSafetyProfile): string[] {
  const errors: string[] = [];
  if (!value.profileId.trim()) errors.push("profileId_required");
  if (value.parentalControlRequired !== true) errors.push("parentalControlRequired_must_remain_true");
  if (value.behaviouralProfilingAllowed !== false) errors.push("behaviouralProfilingAllowed_must_remain_false");
  if (!value.safeguardingOwner.trim()) errors.push("safeguardingOwner_required");
  if (!value.reportingChannel.trim()) errors.push("reportingChannel_required");
  return [...new Set(errors)];
}
