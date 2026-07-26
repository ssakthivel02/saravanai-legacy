export interface SandboxExperiment {
  experimentId: string;
  owner: string;
  syntheticDataOnly: true;
  productionCredentialsAvailable: false;
  budgetPence: number;
  expiresAt: string;
}

export const RELEASE_175_CONTROLS = ["synthetic_data_required", "production_credentials_forbidden", "expiry_required"] as const;

export function validateSandboxExperiment(value: SandboxExperiment): string[] {
  const errors: string[] = [];
  if (!value.experimentId.trim()) errors.push("experimentId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!Number.isFinite(value.budgetPence) || value.budgetPence < 0) errors.push("budgetPence_invalid");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  if (value.syntheticDataOnly !== true) errors.push("syntheticDataOnly_must_remain_true");
  if (value.productionCredentialsAvailable !== false) errors.push("productionCredentialsAvailable_must_remain_false");
  return [...new Set(errors)];
}
