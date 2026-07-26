import type { MultimodalAsset } from "./model";

export const RELEASE_062_CONTROL_RULES = ["asset_id_required", "allowed_mime_required", "size_limit_enforced", "consent_required", "sha256_required"] as const;

export function validateMultimodalAsset(input: MultimodalAsset): string[] {
  const errors: string[] = [];
  if (!String(input.assetId ?? "").trim()) errors.push("assetId_required");
  return [...new Set(errors)];
}

export function release062Ready(input: MultimodalAsset): boolean {
  return validateMultimodalAsset(input).length === 0;
}
