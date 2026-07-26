export interface EventSchema {
  schemaId: string;
  eventType: string;
  version: number;
  compatibility: 'backward' | 'forward' | 'full';
  owner: string;
  retentionDays: number;
  containsPersonalData: boolean;
  status: 'draft' | 'approved' | 'retired';
}

export const RELEASE_193_CONTROLS = ["schema_version_required", "compatibility_declared", "owner_required", "privacy_classification_required"] as const;

export function validateEventSchema(value: EventSchema): string[] {
  const errors: string[] = [];
  if (!value.schemaId.trim()) errors.push("schemaId_required");
  if (!value.eventType.trim()) errors.push("eventType_required");
  if (!Number.isFinite(value.version) || value.version < 0) errors.push("version_invalid");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!Number.isFinite(value.retentionDays) || value.retentionDays < 0) errors.push("retentionDays_invalid");
  return [...new Set(errors)];
}
