export interface LocaleRelease {
  locale: string;
  version: string;
  direction: 'ltr' | 'rtl';
  terminologySetId: string;
  missingKeys: string[];
  reviewedBy: string | undefined;
}

export const RELEASE_145_CONTROLS = ["terminology_governed", "missing_keys_block", "native_review_required"] as const;

export function validateLocaleRelease(value: LocaleRelease): string[] {
  const errors: string[] = [];
  if (!value.locale.trim()) errors.push("locale_required");
  if (!value.version.trim()) errors.push("version_required");
  if (!value.terminologySetId.trim()) errors.push("terminologySetId_required");
  if (!value.missingKeys.length) errors.push("missingKeys_required");
  return [...new Set(errors)];
}
