export interface LanguageAsset {
  assetId: string;
  sourceLocale: string;
  targetLocale: string;
  terminologySetId: string;
  translationRef: string;
  confidence: number;
  nativeReviewer: string;
  status: 'draft' | 'reviewed' | 'published';
}

export const RELEASE_274_CONTROLS = ["locale_pair_required", "terminology_required", "confidence_bounded", "native_review_required"] as const;

export function validateLanguageAsset(value: LanguageAsset): string[] {
  const errors: string[] = [];
  if (!value.assetId.trim()) errors.push("assetId_required");
  if (!value.sourceLocale.trim()) errors.push("sourceLocale_required");
  if (!value.targetLocale.trim()) errors.push("targetLocale_required");
  if (!value.terminologySetId.trim()) errors.push("terminologySetId_required");
  if (!value.translationRef.trim()) errors.push("translationRef_required");
  if (!Number.isFinite(value.confidence) || value.confidence < 0) errors.push("confidence_invalid");
  if (!value.nativeReviewer.trim()) errors.push("nativeReviewer_required");
  if (value.confidence < 0 || value.confidence > 1) errors.push("confidence_out_of_range");
  return [...new Set(errors)];
}
