import type { CodeAnalysisFinding } from "./model";

export const RELEASE_069_CONTROL_RULES = ["repository_scope_required", "path_required", "secret_material_never_persisted", "critical_finding_blocks_release"] as const;

export function validateCodeAnalysisFinding(input: CodeAnalysisFinding): string[] {
  const errors: string[] = [];
  if (!String(input.findingId ?? "").trim()) errors.push("findingId_required");
  if (input.secretMaterialPresent) errors.push("secret_material_must_not_be_persisted");
  return [...new Set(errors)];
}

export function release069Ready(input: CodeAnalysisFinding): boolean {
  return validateCodeAnalysisFinding(input).length === 0;
}
