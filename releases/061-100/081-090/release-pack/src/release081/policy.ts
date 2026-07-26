import type { PrivacyRule } from "./model";

export const RELEASE_081_CONTROL_RULES = ["purpose_required", "data_classes_required", "legal_basis_required", "retention_positive", "rights_mapping_required"] as const;

export function validatePrivacyRule(input: PrivacyRule): string[] {
  const errors: string[] = [];
  if (!String(input.ruleId ?? "").trim()) errors.push("ruleId_required");
  if (!input.dataClasses.length) errors.push("dataClasses_required");
  if (!input.regions.length) errors.push("regions_required");
  if (!input.rightsSupported.length) errors.push("rightsSupported_required");
  return [...new Set(errors)];
}

export function release081Ready(input: PrivacyRule): boolean {
  return validatePrivacyRule(input).length === 0;
}
