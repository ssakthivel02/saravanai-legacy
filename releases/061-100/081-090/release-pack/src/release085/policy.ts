import type { TransparencyRecord } from "./model";

export const RELEASE_085_CONTROL_RULES = ["plain_language_summary_required", "limitations_required", "data_use_required", "human_review_disclosed", "publication_approval_required"] as const;

export function validateTransparencyRecord(input: TransparencyRecord): string[] {
  const errors: string[] = [];
  if (!String(input.recordId ?? "").trim()) errors.push("recordId_required");
  return [...new Set(errors)];
}

export function release085Ready(input: TransparencyRecord): boolean {
  return validateTransparencyRecord(input).length === 0;
}
