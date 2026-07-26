export interface NotificationPolicy {
  policyId: string;
  tenantId: string;
  channels: string[];
  quietHoursTimezone: string;
  urgentCategories: string[];
  darkPatternsAllowed: false;
}

export const RELEASE_146_CONTROLS = ["consent_required", "quiet_hours_required", "dark_patterns_forbidden"] as const;

export function validateNotificationPolicy(value: NotificationPolicy): string[] {
  const errors: string[] = [];
  if (!value.policyId.trim()) errors.push("policyId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.channels.length) errors.push("channels_required");
  if (!value.quietHoursTimezone.trim()) errors.push("quietHoursTimezone_required");
  if (!value.urgentCategories.length) errors.push("urgentCategories_required");
  if (value.darkPatternsAllowed !== false) errors.push("darkPatternsAllowed_must_remain_false");
  return [...new Set(errors)];
}
