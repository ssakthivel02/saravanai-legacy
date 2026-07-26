export interface BillingReadinessProfile {
  profileId: string;
  currency: string;
  taxReviewRequired: boolean;
  invoiceGenerationEnabled: false;
  paymentCollectionEnabled: false;
  unifiedBillingEnabled: false;
}

export const RELEASE_159_CONTROLS = ["tax_review_required", "invoice_disabled", "payment_collection_disabled"] as const;

export function validateBillingReadinessProfile(value: BillingReadinessProfile): string[] {
  const errors: string[] = [];
  if (!value.profileId.trim()) errors.push("profileId_required");
  if (!value.currency.trim()) errors.push("currency_required");
  if (value.invoiceGenerationEnabled !== false) errors.push("invoiceGenerationEnabled_must_remain_false");
  if (value.paymentCollectionEnabled !== false) errors.push("paymentCollectionEnabled_must_remain_false");
  if (value.unifiedBillingEnabled !== false) errors.push("unifiedBillingEnabled_must_remain_false");
  return [...new Set(errors)];
}
