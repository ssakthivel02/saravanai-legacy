export interface EditorialItem {
  itemId: string;
  owner: string;
  editor: string;
  contentType: string;
  reviewAt: string;
  sourceRefs: string[];
  correctionOf: string | undefined;
  status: 'commissioned' | 'draft' | 'review' | 'approved' | 'archived';
}

export const RELEASE_272_CONTROLS = ["owner_required", "editor_required", "review_date_required", "correction_supported"] as const;

export function validateEditorialItem(value: EditorialItem): string[] {
  const errors: string[] = [];
  if (!value.itemId.trim()) errors.push("itemId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.editor.trim()) errors.push("editor_required");
  if (!value.contentType.trim()) errors.push("contentType_required");
  if (!value.reviewAt.trim()) errors.push("reviewAt_required");
  if (!value.sourceRefs.length) errors.push("sourceRefs_required");
  return [...new Set(errors)];
}
