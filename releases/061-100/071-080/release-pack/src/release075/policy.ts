import type { PublicationRecord } from "./model";

export const RELEASE_075_CONTROL_RULES = ["title_required", "content_hash_required", "sources_required", "human_publisher_required", "withdrawal_preserves_audit"] as const;

export function validatePublicationRecord(input: PublicationRecord): string[] {
  const errors: string[] = [];
  if (!String(input.publicationId ?? "").trim()) errors.push("publicationId_required");
  if (!input.sourceIds.length) errors.push("sourceIds_required");
  if (!input.sourceIds.length) errors.push("source_required");
  return [...new Set(errors)];
}

export function release075Ready(input: PublicationRecord): boolean {
  return validatePublicationRecord(input).length === 0;
}
