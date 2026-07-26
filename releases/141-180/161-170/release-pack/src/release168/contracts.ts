export interface TestDataSet {
  dataSetId: string;
  classification: 'synthetic' | 'anonymised' | 'restricted';
  sourceRefs: string[];
  expiresAt: string;
  productionSecretsIncluded: false;
  owner: string;
}

export const RELEASE_168_CONTROLS = ["classification_required", "expiry_required", "production_secrets_forbidden"] as const;

export function validateTestDataSet(value: TestDataSet): string[] {
  const errors: string[] = [];
  if (!value.dataSetId.trim()) errors.push("dataSetId_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (value.productionSecretsIncluded !== false) errors.push("productionSecretsIncluded_must_remain_false");
  return [...new Set(errors)];
}
