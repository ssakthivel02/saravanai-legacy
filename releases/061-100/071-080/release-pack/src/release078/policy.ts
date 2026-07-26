import type { DataProduct } from "./model";

export const RELEASE_078_CONTROL_RULES = ["owner_required", "schema_required", "quality_slo_required", "semantic_version_required", "deprecation_notice_required"] as const;

export function validateDataProduct(input: DataProduct): string[] {
  const errors: string[] = [];
  if (!String(input.productId ?? "").trim()) errors.push("productId_required");
  return [...new Set(errors)];
}

export function release078Ready(input: DataProduct): boolean {
  return validateDataProduct(input).length === 0;
}
