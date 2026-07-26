import type { OntologyContract } from "./model";

export const RELEASE_066_CONTROL_RULES = ["persistent_namespace_required", "semantic_version_required", "duplicate_identifier_denied", "approval_required_for_active_contract"] as const;

export function validateOntologyContract(input: OntologyContract): string[] {
  const errors: string[] = [];
  if (!String(input.contractId ?? "").trim()) errors.push("contractId_required");
  if (!input.classIds.length) errors.push("classIds_required");
  if ((input as any).status === "approved" && !input.approvedBy) errors.push("approved_by_required");
  return [...new Set(errors)];
}

export function release066Ready(input: OntologyContract): boolean {
  return validateOntologyContract(input).length === 0;
}
